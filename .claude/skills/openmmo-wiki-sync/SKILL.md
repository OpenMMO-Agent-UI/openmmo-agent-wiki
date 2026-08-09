---
name: openmmo-wiki-sync
description: Fully-unattended daily flow that reconciles this wiki with the upstream OpenMMO game repo — syncs game data, fills in zh/ko translations, extends the changelog per protocol bump, and documents new gameplay systems in all three locales. Runs on a schedule (launchd, daily) — invoke manually only to test the flow or force a run.
---

# OpenMMO wiki upstream content sync

This wiki (Astro/Starlight; zh-TW root, `/en/`, `/ko/`) documents a live game
that changes without notice. The GitHub Action `check-drift.yml` detects
drift once a day and opens an issue; this skill is the half that actually
*fixes* it: read what changed upstream, update data, prose, and changelog in
all three locales, verify the build, and push.

Upstream (public, read-only): `https://github.com/OpenMMO-Agent-UI/OpenMMO`.

The run is unattended: no step pauses for approval. The only things that
stop a run early are the safety gates (build failure, diverged checkout) —
they abort loudly rather than asking.

Every run ends with **at most one** `PushNotification`: one on
success-with-changes, one on failure. A run that finds nothing new exits
quietly — that is the routine case, not news.

## Step 0: is there anything to do? (cheap, no clone)

```
cd <repo root>
git ls-remote https://github.com/OpenMMO-Agent-UI/OpenMMO refs/heads/master
cat scripts/.last-upstream-sync
```

If the remote master SHA equals the recorded SHA, **stop here. No
notification.** (If `scripts/.last-upstream-sync` is missing, keep going —
Step 2's state comparison is the fallback.)

## Step 1: bring this checkout and the upstream reading copy up to date

```
git fetch origin && git status --short --branch
```

- If local `main` is behind `origin/main`, `git pull --ff-only`.
- If it has diverged or the working tree is dirty, **abort with a failure
  notification** — another session is mid-flight here, and an unattended
  run must not resolve that.

Then make a disposable reading copy of upstream (never push to it):

```
git clone --depth 150 --filter=blob:none \
  https://github.com/OpenMMO-Agent-UI/OpenMMO "$(mktemp -d)/upstream"
```

The sync window is `<recorded SHA>..origin/master` in that clone. If the
recorded SHA is missing or unreachable (history deepened past it), fall back
to state comparison: vendored CSVs vs `data-src/`, the newest protocol in
`src/content/docs/updates/index.md` vs `PROTOCOL_VERSION` in
`shared/src/lib.rs`, and `src/lib/classes.js` vs `shared/src/character.rs`.

## Step 2: sync the data layer

```
node scripts/sync-gamedata.mjs
```

If CSVs changed:

- Every new item id needs a name **and description** in `src/lib/zh.js` and
  `src/lib/ko.js`; new monsters/dungeons need names there too. `src/lib/en.js`
  derives from the CSVs automatically — leave it alone except for the
  hand-maintained maps it does carry (categories, slots, materials).
- A new category / equip slot / material needs an entry in the corresponding
  name map in **all three** lib files.
- A new CSV column needs a field mapped in `src/lib/gamedata.js` like its
  siblings, even if no page displays it yet.
- A new player-selectable class (`shared/src/character.rs`) goes into
  `src/lib/classes.js` (HIT_DIE + the classes array, zh name inline) and
  `classNames` in `src/lib/ko.js`. NPC-only classes go into `hiddenClasses`.

Translation style: match the existing entries' register — zh-TW uses
Taiwan-game conventions, ko descriptions use plain declarative 한다체 in the
item maps (see the neighbours you are inserting next to).

## Step 3: changelog, per protocol bump

Read the window's commits in the upstream clone (`git log --stat`, key
diffs, `doc/*.md` changes). For each change to `PROTOCOL_VERSION` in
`shared/src/lib.rs`, add a section to `src/content/docs/updates/index.md`
**and** its `en/` and `ko/` counterparts, following the existing format
exactly (category labels 新系統 / 平衡調整 / 新道具與素材 / 修正 / 效能 /
客戶端 and their en/ko equivalents). Move the current-version marker —
(目前版本) / (current) / (현재 버전) — to the newest protocol section and
drop the "this is what the server requires" sentence from the section that
loses it.

Player-visible changes that did not bump the protocol (balance numbers, new
NPCs, new commands) go into the newest section with their dates, the way
existing entries do.

## Step 4: guides for new gameplay

For a genuinely new system (new slash command, new mechanic, new NPC with
behavior): if an existing guide covers the area, extend it in all three
locales; otherwise create `src/content/docs/guides/<name>.mdx` plus `en/`
and `ko/` versions in the site's voice, and add **one** sidebar entry with
translations in `astro.config.mjs`.

**Every mechanic you write must be verified in upstream sources** —
`server/src/`, `shared/src/`, `doc/*.md`, or
`agent-client/data/templates/`. Never invent numbers or behavior. If you
cannot verify something, leave it out and say so in the commit message.

Do not touch `src/content/docs/**/client/**` — those pages track the
desktop client, which a different pipeline keeps in sync.

Never delete or rewrite existing hand-written sections unless they became
factually wrong; when a number changed upstream, update it in place.

## Step 5: verify (the safety gates)

```
npm ci
npm run build          # must succeed — abort on failure
node scripts/check-drift.mjs
```

Grep `dist/` to confirm each new name renders in all three locales. The
drift script's **game-data check must report parity**; its release/protocol
check may legitimately fail while the client release lags the server — that
is fixed by the client repo's pipeline, not from here.

## Step 6: record the sync point and push

Write the upstream `origin/master` SHA the run reconciled against into
`scripts/.last-upstream-sync`, commit everything to `main` with a message
that says what changed upstream and what was updated, and push. The site
deploys automatically on push.

If some upstream change was too ambiguous to document confidently, still
ship everything else, and describe the open question in the commit message
body (and a `gh issue create` on this repo if `gh` works) so a human can
follow up.

## Step 7: notify

One `PushNotification` summarizing what was synced (or what failed and at
which gate). Quiet exit if Step 0 short-circuited.

## Local environment prerequisites

- Node 22 must be first in PATH (the cron wrapper handles this; nvm shell
  functions are not available headless).
- The checkout's `origin` must be pushable over SSH
  (`git@github.com:OpenMMO-Agent-UI/openmmo-agent-wiki.git`).
