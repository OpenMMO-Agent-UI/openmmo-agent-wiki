#!/usr/bin/env node
// Pulls the game's source data straight from upstream so the database pages
// can't drift from what the server actually loads. Vendored rather than
// fetched at build time: the site must build offline and in CI without
// depending on GitHub being reachable.

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM = 'https://raw.githubusercontent.com/OpenMMO-Agent-UI/OpenMMO/master/data-src';
const FILES = [
  'items.csv',
  'monsters.csv',
  'dungeons.csv',
  'merchants.csv',
  'npcs.csv',
  'world_drop.csv',
  'map_labels.csv',
  'debuffs.csv',
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'game');

async function main() {
  await mkdir(outDir, { recursive: true });
  let changed = 0;

  for (const file of FILES) {
    const res = await fetch(`${UPSTREAM}/${file}`);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    const next = await res.text();

    const path = join(outDir, file);
    const prev = await readFile(path, 'utf8').catch(() => null);
    if (prev === next) {
      console.log(`  = ${file}`);
      continue;
    }
    await writeFile(path, next);
    console.log(`  ${prev === null ? '+' : '~'} ${file}`);
    changed++;
  }

  console.log(changed ? `\n${changed} file(s) changed — review and commit.` : '\nAlready up to date.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
