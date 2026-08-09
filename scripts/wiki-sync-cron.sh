#!/bin/bash
# Invoked by launchd daily (see scripts/to.nexus.openmmo-wiki-sync.plist).
# Not meant to be run by hand except to test the flow — for that, invoke the
# skill interactively instead: `claude` then `/openmmo-wiki-sync`.
set -euo pipefail

# launchd's environment is minimal (no shell profile sourced) — name every
# directory this flow's tools live in explicitly. Node 22 must come first:
# this machine's shell profile wraps node/npm in nvm lazy-load functions
# that do not exist headless, so the real binaries have to win by PATH.
export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.local/bin"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SETTINGS="$REPO_ROOT/.claude/skills/openmmo-wiki-sync/cron-settings.json"

# No --permission-mode flag: the settings file's explicit allow list is what
# makes this headless-safe. Anything outside that list should surface as a
# visible failure to fix, not get papered over with a blanket bypass.
claude -p "/openmmo-wiki-sync" \
  --settings "$SETTINGS"
