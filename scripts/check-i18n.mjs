#!/usr/bin/env node
// Report translation coverage per language, so what is missing is a number
// somebody can see rather than something a reader discovers.
//
//   node scripts/check-i18n.mjs            # report; exit 1 only on a hard gap
//   node scripts/check-i18n.mjs --strict   # exit 1 on any missing page
//
// Starlight falls back to the default locale for an untranslated page, which
// is the right behaviour — a reader gets the content in zh-TW with a notice,
// rather than a 404 — but it also means a language can sit at 3% coverage
// indefinitely and nothing says so.
//
// Two things are hard failures, because they break a language rather than
// leave it incomplete:
//
//   * a sidebar label with no translation, which renders the zh-TW text inside
//     an otherwise translated menu, and
//   * a locale directory holding a page the default locale does not have,
//     which is a translation of something that no longer exists.
//
// Everything else is reported as coverage and left to judgement.

import { readdir, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, PREFIXED, contentDirOf } from '../src/i18n/locales.mjs';
import { LABELS } from '../src/i18n/sidebar.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(root, 'src', 'content', 'docs');
const strict = process.argv.includes('--strict');

async function pagesUnder(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      // A locale directory is not part of the default locale's own pages.
      if (dir === DOCS && PREFIXED.includes(e.name)) continue;
      out.push(...(await pagesUnder(full)));
    } else if (/\.mdx?$/.test(e.name)) {
      out.push(relative(dir === DOCS ? DOCS : dir, full));
    }
  }
  return out;
}

/// Pages of one locale, as paths relative to that locale's content root.
async function pagesOf(code) {
  const dir = code === 'root' ? DOCS : join(DOCS, code);
  const all = [];
  const walk = async (d) => {
    let entries;
    try {
      entries = await readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) {
        if (d === DOCS && PREFIXED.includes(e.name)) continue;
        await walk(full);
      } else if (/\.mdx?$/.test(e.name)) {
        all.push(relative(dir, full).replace(/\\/g, '/'));
      }
    }
  };
  await walk(dir);
  return new Set(all);
}

const base = await pagesOf('root');
const rows = [];
let hardFailures = 0;

for (const code of Object.keys(LOCALES)) {
  const have = code === 'root' ? base : await pagesOf(code);
  const missing = [...base].filter((p) => !have.has(p)).sort();
  const orphaned = [...have].filter((p) => !base.has(p)).sort();
  const labelGaps = Object.entries(LABELS)
    .filter(([, t]) => code !== 'root' && !t[code])
    .map(([zh]) => zh);
  if (orphaned.length || labelGaps.length) hardFailures++;
  rows.push({ code, have: have.size, missing, orphaned, labelGaps });
}

const pct = (n) => `${Math.round((n / base.size) * 100)}%`;

console.log(`## Translation coverage\n`);
console.log(`Default locale (\`root\`, zh-TW) has ${base.size} pages.\n`);
console.log('| language | pages | coverage | untranslated | sidebar gaps | orphaned |');
console.log('|---|---|---|---|---|---|');
for (const r of rows) {
  const translated = base.size - r.missing.length;
  console.log(
    `| \`${r.code}\` ${LOCALES[r.code].label} | ${translated}/${base.size} | ${pct(translated)} | ` +
      `${r.missing.length} | ${r.labelGaps.length || '—'} | ${r.orphaned.length || '—'} |`
  );
}

for (const r of rows) {
  if (r.labelGaps.length) {
    console.log(`\n**\`${r.code}\` is missing ${r.labelGaps.length} sidebar label(s)** — these render in zh-TW:`);
    for (const zh of r.labelGaps) console.log(`  - ${zh}`);
  }
  if (r.orphaned.length) {
    console.log(`\n**\`${r.code}\` has ${r.orphaned.length} page(s) the default locale does not** — translations of pages that no longer exist:`);
    for (const p of r.orphaned) console.log(`  - ${p}`);
  }
}

const untranslated = rows.reduce((n, r) => n + r.missing.length, 0);
if (untranslated) {
  console.log(
    `\n${untranslated} page-translation(s) outstanding across ${rows.filter((r) => r.missing.length).length} language(s).` +
      ` Starlight serves the zh-TW page with a notice for each, so every URL resolves.`
  );
}

if (hardFailures) {
  console.log(`\n${hardFailures} language(s) have a sidebar or orphan problem — those are failures, not gaps.`);
  process.exit(1);
}
if (strict && untranslated) process.exit(1);
process.exit(0);
