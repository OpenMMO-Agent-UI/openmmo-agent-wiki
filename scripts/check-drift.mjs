#!/usr/bin/env node
// Reports where this wiki has fallen behind reality. Run on a schedule so the
// drift surfaces on its own — twice in the first week it was found only
// because someone happened to look, and once that meant the download link
// served a client the server refuses.
//
//   node scripts/check-drift.mjs
//
// Exit 0 when everything matches, 1 on drift, 2 when a check could not run.
// Prints a markdown report on stdout for the workflow to put in an issue.

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER = 'wss://openmmo.to.nexus/ws';
const WIKI_REPO = 'OpenMMO-Agent-UI/openmmo-agent-wiki';
const UPSTREAM = 'https://raw.githubusercontent.com/OpenMMO-Agent-UI/OpenMMO/master';
const CLIENT = 'https://raw.githubusercontent.com/OpenMMO-Agent-UI/openmmo-agent-ui/master';
/// Every translation of the panel page. A name the panel grew has to reach
/// all of them, not just whichever one someone happened to edit.
const PANEL_PAGES = [
  'src/content/docs/client/panel.mdx',
  'src/content/docs/en/client/panel.mdx',
  'src/content/docs/ko/client/panel.mdx',
];
const DATA_FILES = [
  'items.csv', 'monsters.csv', 'dungeons.csv',
  'merchants.csv', 'npcs.csv', 'world_drop.csv', 'map_labels.csv',
];

const wikiRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(wikiRoot, 'src', 'data', 'game');

// --- protocol probe ----------------------------------------------------------

/// One msgpack map entry, `{ ClientInfo: [version, "cli", "wiki-drift-check"] }`.
/// Hand-encoded rather than pulled from a library: it is six bytes of framing
/// plus three strings, and the client's own codec lives in a private repo.
function clientInfo(version) {
  const str = (s) => {
    const b = Buffer.from(s, 'utf8');
    if (b.length > 31) throw new Error(`string too long for fixstr: ${s}`);
    return Buffer.concat([Buffer.from([0xa0 | b.length]), b]);
  };
  if (version < 0 || version > 127) throw new Error('version outside positive fixint');
  return Buffer.concat([
    Buffer.from([0x81]),              // fixmap, 1 entry
    str('ClientInfo'),
    Buffer.from([0x93]),              // fixarray, 3 items
    Buffer.from([version]),           // positive fixint
    str('cli'),
    str('wiki-drift-check'),
  ]);
}

/// Asks the live server what it speaks by handshaking with a version it cannot
/// possibly still accept, so the refusal names the current one. The reply is
/// scanned as raw UTF-8 rather than decoded — the version sits in a plain error
/// string, and matching it needs no msgpack parser.
function askServerProtocol(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      try { ws.close(); } catch { /* already closing */ }
      fn(value);
    };

    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', () => ws.send(clientInfo(1)));
    ws.addEventListener('message', (event) => {
      const text = Buffer.from(event.data).toString('utf8');
      const m = text.match(/Protocol v(\d+) required/);
      if (m) finish(resolve, Number(m[1]));
    });
    ws.addEventListener('error', () => finish(reject, new Error(`${url} did not answer`)));
    ws.addEventListener('close', () => finish(reject, new Error('closed without naming a protocol version')));
    setTimeout(() => finish(reject, new Error('timed out')), 15000);
  });
}

// --- what the wiki currently serves -----------------------------------------

async function wikiRelease() {
  const res = await fetch(`https://api.github.com/repos/${WIKI_REPO}/releases/latest`, {
    headers: { accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`releases/latest: HTTP ${res.status}`);
  const body = await res.json();
  // The publish workflow writes "OpenMMO Agent v0.19.0 (protocol v19)".
  const m = String(body.name ?? '').match(/v([\d.]+)\s*\(protocol v(\d+)\)/);
  if (!m) throw new Error(`cannot read a protocol version from release name: ${body.name}`);
  return { tag: body.tag_name, version: m[1], protocol: Number(m[2]) };
}

// --- vendored game data ------------------------------------------------------

async function staleDataFiles() {
  const stale = [];
  for (const file of DATA_FILES) {
    const res = await fetch(`${UPSTREAM}/data-src/${file}`);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    const upstream = await res.text();
    const local = await readFile(join(dataDir, file), 'utf8').catch(() => null);
    if (local !== upstream) stale.push(file);
  }
  return stale;
}

// --- the panel the client actually ships -------------------------------------

/// The panel's own navigation, read out of the markup that draws it: the three
/// rail buttons, and the tab strips inside the Character drawer, the Activity
/// drawer and Settings. These are the names a reader looks for, so they are
/// the ones worth gating on — prose can describe a field in its own words, but
/// a drawer the page never names cannot be found at all.
///
/// This is the check the drift report was missing, and the only moving part it
/// did not watch. The panel page sat at client v0.19.0 while the client went
/// to v0.75.1: by then it described six drawers that no longer exist, named
/// two settings tabs that had been replaced, and had never once mentioned the
/// Auto Worker — the drawer that grew the fighter, the fisher and the dungeon
/// conqueror, which is most of what the app does now. Nothing was broken
/// enough to notice; it was just quietly wrong for fifty-odd releases.
function panelNames(html) {
  const names = new Set();
  // Rail buttons carry their label in aria-label (the icons are unlabelled on
  // purpose; the text appears on hover and focus).
  for (const m of html.matchAll(/data-drawer="[a-z-]+"\s+aria-label="([^"]+)"/g)) {
    names.add(m[1]);
  }
  // Tab strips put the label in the button's text.
  for (const m of html.matchAll(
    /data-(?:settings|character|activity)-tab="[a-z-]+"[^>]*>([^<]+)</g
  )) {
    names.add(m[1].trim());
  }
  return [...names];
}

async function undocumentedPanelNames() {
  const res = await fetch(`${CLIENT}/src/renderer/index.html`);
  if (!res.ok) throw new Error(`index.html: HTTP ${res.status}`);
  const names = panelNames(await res.text());
  if (names.length < 6) {
    throw new Error(`read only ${names.length} panel names — the markup moved`);
  }

  const missing = new Map();
  for (const page of PANEL_PAGES) {
    const text = await readFile(join(wikiRoot, page), 'utf8').catch(() => null);
    if (text === null) {
      missing.set(page, ['(page is missing entirely)']);
      continue;
    }
    const absent = names.filter((name) => !text.includes(name));
    if (absent.length) missing.set(page, absent);
  }
  return { names, missing };
}

// --- report ------------------------------------------------------------------

async function main() {
  const problems = [];
  const lines = [];

  let serverProtocol = null;
  try {
    serverProtocol = await askServerProtocol(SERVER);
    lines.push(`- Live server requires **protocol v${serverProtocol}**`);
  } catch (err) {
    console.error(`could not reach the game server: ${err.message}`);
    process.exitCode = 2;
    lines.push(`- ⚠️ Could not reach the game server: ${err.message}`);
  }

  try {
    const release = await wikiRelease();
    lines.push(`- Wiki serves **${release.tag}** (client v${release.version}, protocol v${release.protocol})`);
    if (serverProtocol !== null && release.protocol !== serverProtocol) {
      problems.push(
        `**The download link is broken.** The wiki serves protocol v${release.protocol} ` +
        `but the server requires v${serverProtocol}, so anyone downloading it right now ` +
        `cannot connect. Mirror the matching client release ` +
        `(\`gh workflow run publish-downloads.yml --repo OpenMMO-Agent-UI/openmmo-agent-ui -f tag=vX.Y.Z\`).`
      );
    }
  } catch (err) {
    console.error(`could not read the wiki release: ${err.message}`);
    process.exitCode = 2;
    lines.push(`- ⚠️ Could not read the wiki release: ${err.message}`);
  }

  try {
    const stale = await staleDataFiles();
    if (stale.length) {
      problems.push(
        `**Game data has moved upstream** (${stale.join(', ')}). ` +
        `Run \`node scripts/sync-gamedata.mjs\`, rebuild, and check any prose that ` +
        `names a specific item or number — the generated tables update themselves, ` +
        `hand-written claims do not.`
      );
    } else {
      lines.push('- Vendored game data matches upstream');
    }
  } catch (err) {
    console.error(`could not compare game data: ${err.message}`);
    process.exitCode = 2;
    lines.push(`- ⚠️ Could not compare game data: ${err.message}`);
  }

  try {
    const { names, missing } = await undocumentedPanelNames();
    if (missing.size) {
      const detail = [...missing]
        .map(([page, absent]) => `  - \`${page}\`: ${absent.join(', ')}`)
        .join('\n');
      problems.push(
        `**The panel page does not describe the panel the client ships.** These names ` +
        `appear in the app and not in the docs:\n\n${detail}\n\n  Read ` +
        `\`src/renderer/index.html\` in openmmo-agent-ui for what each one now holds. ` +
        `A reader who cannot find a drawer by name cannot find it at all.`
      );
    } else {
      lines.push(`- Panel docs name all ${names.length} of the panel's drawers and tabs`);
    }
  } catch (err) {
    console.error(`could not compare the panel docs: ${err.message}`);
    process.exitCode = 2;
    lines.push(`- ⚠️ Could not compare the panel docs: ${err.message}`);
  }

  console.log(lines.join('\n'));
  if (problems.length) {
    console.log(`\n## What needs doing\n\n${problems.map((p) => `- ${p}`).join('\n\n')}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.stack ?? err.message);
  process.exit(2);
});
