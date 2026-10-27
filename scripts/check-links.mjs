#!/usr/bin/env node
// Resolve every internal link in the docs and report the ones that land
// nowhere. Run in CI before deploy, because a link that 404s is invisible to
// the author: Astro does not check them, `astro build` is happy, and the page
// looks finished.
//
//   node scripts/check-links.mjs
//
// Exit 0 when every link resolves, 1 when any does not. Prints a markdown
// report on stdout.
//
// What makes this worth a script rather than care: these are *relative* links,
// and the depth that is correct depends on whether the page is an `index` file.
// `guides/combat.mdx` serves at `/guides/combat/`, so `../field-raid/` from it
// means `/guides/field-raid/`. But `updates/index.md` serves at `/updates/`,
// one segment shallower than its path suggests, so the same `../../guides/…`
// that is right in `guides/titles.mdx` walks off the base path entirely and
// silently resolves to `/guides/…` with the `/openmmo-agent-wiki` prefix
// eaten. Nothing about the source says which case you are in.
//
// Fragments are checked too, against the headings the target page actually
// has — slugged with the same github-slugger Starlight uses, so a CJK heading
// keeps its characters and `#獎勵` is a real anchor to compare against.

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { PREFIXED } from '../src/i18n/locales.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(root, 'src', 'content', 'docs');
const BASE = '/openmmo-agent-wiki';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (['.md', '.mdx'].includes(extname(entry.name))) out.push(full);
  }
  return out;
}

/// The URL a docs file serves at. Starlight drops the extension, turns
/// `index` into its directory, and keeps the locale directories (`ko/`, `en/`)
/// as path prefixes — `root` is the default locale and carries no prefix.
function urlOf(file) {
  const rel = relative(DOCS, file).replace(/\\/g, '/');
  const noExt = rel.replace(/\.mdx?$/, '');
  const segments = noExt === 'index' ? [] : noExt.replace(/\/index$/, '').split('/');
  return `${BASE}/${segments.join('/')}${segments.length ? '/' : ''}`;
}

/// Headings as Starlight ids them, plus the explicit `{#id}` form if used.
function headingIds(source) {
  const slugger = new GithubSlugger();
  const ids = new Set();
  for (const line of source.split('\n')) {
    const m = /^#{1,6}\s+(.*)$/.exec(line.trim());
    if (!m) continue;
    let text = m[1].trim();
    const explicit = /\{#([^}]+)\}\s*$/.exec(text);
    if (explicit) {
      ids.add(explicit[1]);
      text = text.slice(0, explicit.index).trim();
    }
    // Only the markers github-slugger would otherwise keep. It already drops
    // `*` and punctuation, and it keeps `_` because that is a word character —
    // so stripping underscores here turned `lay_stall` into `laystall` and
    // reported four headings as missing that were never missing.
    text = text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`/g, '')
      .replace(/\*\*/g, '')
      .trim();
    if (text) ids.add(slugger.slug(text));
  }
  return ids;
}

/// Markdown links and bare hrefs. Deliberately not a full parser: the goal is
/// to find every target, and over-matching a code sample is cheaper than
/// missing a real link. Fenced code is skipped so examples do not get checked.
function linksIn(source) {
  const withoutCode = source
    .replace(/```[\s\S]*?```/g, '')
    // Inline code too: `E[裝備](N)` in the enchanting maths is expected-value
    // notation, and it is character-for-character a markdown link.
    .replace(/`[^`\n]*`/g, '');
  const found = [];
  for (const m of withoutCode.matchAll(/\[(?:[^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    found.push(m[1]);
  }
  for (const m of withoutCode.matchAll(/href=["']([^"']+)["']/g)) found.push(m[1]);
  return found;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/// Which translation a URL belongs to. `root` is the default locale and carries
/// no prefix, so anything without a language prefix is the zh-TW copy. Taken
/// from the one registry rather than listed again here — this used to say
/// `['ko', 'en']`, and when nine more languages landed every one of their
/// links would have read as the default locale and the check would have
/// stopped meaning anything.
const LOCALES = new Set(PREFIXED);
function localeOf(url) {
  const first = url.slice(BASE.length).replace(/^\//, '').split('/')[0];
  return LOCALES.has(first) ? first : 'root';
}

const files = (await walk(DOCS)).sort();
const pages = new Map();
for (const file of files) {
  const source = await readFile(file, 'utf8');
  pages.set(urlOf(file), { file, ids: headingIds(source), source });
}

const problems = [];
for (const [url, page] of pages) {
  for (const raw of linksIn(page.source)) {
    if (EXTERNAL.test(raw)) continue;
    const [target, fragment] = raw.split('#');
    let resolved;
    if (!target) {
      resolved = url; // same-page fragment
    } else {
      // Resolve the way a browser would, against this page's own URL.
      resolved = new URL(target, `https://x${url}`).pathname;
      if (!resolved.endsWith('/') && !extname(resolved)) resolved += '/';
    }
    const where = relative(root, page.file);
    // Starlight serves the default locale's page for anything a language has
    // not translated, so `/fr/guides/x/` exists as long as `/guides/x/` does.
    // Resolving only against source files called all 270 of those broken.
    const fallbackOf = (url) => {
      const m = new RegExp(`^${BASE}/(${PREFIXED.join('|')})/`).exec(url);
      return m ? url.replace(`${BASE}/${m[1]}/`, `${BASE}/`) : null;
    };
    const hit = pages.get(resolved) ?? pages.get(fallbackOf(resolved) ?? '');
    if (!hit) {
      // Say what it should have been when exactly one page would match the
      // last segment — that is the fix nine times out of ten.
      const tail = resolved.replace(/\/$/, '').split('/').pop();
      const guesses = [...pages.keys()].filter((p) => p.replace(/\/$/, '').endsWith(`/${tail}`));
      problems.push({
        where,
        raw,
        resolved,
        reason: resolved.startsWith(`${BASE}/`) ? 'no such page' : `escapes the base path (${BASE})`,
        suggest: guesses.length === 1 ? guesses[0] : null,
      });
      continue;
    }
    // The quiet one. A `../../` from `ko/updates/index.md` lands on
    // `/guides/…` — the zh-TW copy — which is a page that exists, so it is
    // not a 404 and nothing complains. The reader just stops being able to
    // read it. This is the failure that prompted the audit.
    if (localeOf(resolved) !== localeOf(url)) {
      const sameLocale = localeOf(url) === 'root'
        ? resolved.replace(new RegExp(`^${BASE}/(?:ko|en)/`), `${BASE}/`)
        : resolved.replace(`${BASE}/`, `${BASE}/${localeOf(url)}/`);
      problems.push({
        where,
        raw,
        resolved,
        reason: `leaves the ${localeOf(url)} translation for ${localeOf(resolved)}`,
        suggest: pages.has(sameLocale) ? sameLocale : null,
      });
      continue;
    }
    if (fragment && !hit.ids.has(decodeURIComponent(fragment))) {
      problems.push({
        where,
        raw,
        resolved: `${resolved}#${fragment}`,
        reason: `no heading "${decodeURIComponent(fragment)}" on that page`,
        suggest: null,
      });
    }
  }
}

const checked = [...pages.values()].reduce((n, p) => n + linksIn(p.source).length, 0);
if (problems.length === 0) {
  console.log(`All internal links resolve — ${checked} link(s) across ${pages.size} page(s).`);
  process.exit(0);
}

console.log(`## Broken internal links\n`);
console.log(`${problems.length} of ${checked} link(s) across ${pages.size} page(s) do not resolve.\n`);
console.log('| page | link | resolves to | problem | should be |');
console.log('|---|---|---|---|---|');
for (const p of problems) {
  console.log(
    `| \`${p.where}\` | \`${p.raw}\` | \`${p.resolved}\` | ${p.reason} | ${p.suggest ? `\`${p.suggest}\`` : '—'} |`
  );
}
process.exit(1);
