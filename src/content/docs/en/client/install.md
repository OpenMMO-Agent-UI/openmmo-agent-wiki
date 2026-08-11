---
title: Install and first run
description: Opening it the first time (macOS just opens; Windows needs Run anyway), signing in with Google, creating a character and entering play.
---

## Opening it the first time

### macOS — it just opens

**The macOS build is signed with an Apple Developer ID, notarized by Apple, and
has the ticket stapled into the app.** Unzip it, double-click, and it runs with
no Gatekeeper warning.

You do not need right-click → Open, and you do not need `xattr -cr` — the advice
you'll find online for unsigned apps does not apply to this build.

### Windows — one extra click

**The Windows build is unsigned**, so SmartScreen shows "Windows protected your
PC". Click **More info** → **Run anyway**.

Code signing certificates cost money every year and there is currently only one,
for macOS. If the project is useful to you,
[supporting it](https://ko-fi.com/dakywang) helps put a Windows certificate in
reach.

### Linux — set the executable bit

AppImages have no signing to speak of; they just need to be executable:

```bash
chmod +x openmmo-agent-*linux-x64.AppImage
./openmmo-agent-*linux-x64.AppImage
```

## First run

Four screens in order and you're in the game. **There is no separate "Play"
step** — picking a character enters play immediately.

### 1. Server — pick a connection profile

The built-in `openmmo.to.nexus` profile is fixed, and it's the one most players
want.

A profile binds three things together: the server URL, the terrain asset
origin, and a Google client ID/secret. They have to travel as a set, because a
server only accepts sign-in tokens issued by a client ID on its own allowlist.
If you run your own server you can create, edit, duplicate and delete custom
profiles, and test-connect one before using it.

### 2. Login — Google device flow

Press the button and a code appears; enter it in your browser. A cached
credential skips straight to the next step.

### 3. Character — pick or create

Two tabs:

- **Choose your character** — up to 3 per account (server-enforced). Click to
  enter play, or delete.
- **Create a new character** — name, class, gender. Hidden once you're at the
  cap.

### 4. Game

The mode is decided for you on entry: **automatic if an LLM backend is
configured and passes validation, manual otherwise**. If automatic fails to
start, it falls back to manual. You can switch at any time from the header.

## The two play modes

The server permits exactly one controlling session per character, so the two
modes get there differently.

**Manual play** is a direct connection — the embedded OpenMMO web client signs
in with your own Google account and talks straight to the server, exactly like
playing in a browser. No relay, no `agent-client`.

**Automatic play** launches `agent-client`, which needs that one session for
itself — so watching it can't mean logging in next to it. Instead a relay sits
on loopback:

```
agent-client <--ws--> proxy (127.0.0.1) <--wss--> openmmo.to.nexus
                        |
                        +--> spectators (/mirror)
```

The server has no idea anything is behind the agent. Sitting in the middle lets
the relay tee every server message to a read-only spectator view.
**The relay binds `127.0.0.1` only, so nothing leaves your machine.**

## The game screen

The header shows connection status, vitals, spectator memory use, a reload
button for the 3D view, the manual/AI switch, and buttons to change character
or server. Change a setting while the agent is running and an
**Apply & restart** button appears.

The left rail opens six drawers:

| Drawer | What it shows |
|---|---|
| Equipment | What's worn, slot by slot |
| Bag | What's carried, and which items the agent may sell or drop |
| Personality & Memory | This character's own prompt (editable) and what the agent has written down (read-only) |
| Coordinates | Place bookmarks, including "use current position" |
| Dispatch Presets | Frequently used instructions saved as one-click buttons |
| Activity | Two tabs: Thoughts (every prompt and reply) and Log (the agent process's output) |

Each drawer is covered in detail in [Panel reference](../panel/).

**Dispatch**, docked under the game view, is the one control that reaches a
running agent: type an instruction and it arrives as the character's next turn,
**best-effort — no guarantee it will be followed.**

## Where your keys live

API keys and connection-profile secrets are encrypted with the OS keychain
(Electron `safeStorage`, with an AES-GCM fallback) and handed to the agent as
environment variables — **never written into `config.toml`.** A config pasted
into a bug report carries no credential.

## Troubleshooting

**Protocol version mismatch** — the server has been updated. Grab a new build
from the [download page](../download/).

**Changed a setting and nothing happened** — the agent reads its config once at
startup. Press **Apply & restart** in the header.

**Launched from a VS Code terminal and it never opens** — VS Code is itself an
Electron app and leaks `ELECTRON_RUN_AS_NODE=1`, starting the client as plain
Node:

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

**Something is missing or frozen in the spectator view** — automatic play's
spectator view starts from a snapshot, so anything the agent knows about but
isn't currently tracking appears as it comes back into view.
