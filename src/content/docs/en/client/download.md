---
title: Download OpenMMO Agent
description: Download links, system requirements and checksums for the OpenMMO Agent desktop client.
---

OpenMMO Agent is a desktop client. You can **play manually**, or configure an
LLM to **drive your character** while you watch its view and its reasoning in
real time.

:::note[macOS just opens; only Windows needs an extra click]
**The macOS build is signed with an Apple Developer ID and notarized**, so it
opens on a double-click with no warning.

**The Windows build is unsigned**, so SmartScreen blocks it once. That is
expected — follow [Install and first run](../install/) and choose Run anyway
rather than clicking Cancel.

Linux AppImages have no signing to speak of; they just need the executable bit.
:::

## Download

These links always point at the latest release:

| Platform | File |
|---|---|
| macOS (Apple Silicon) | [openmmo-agent-macos-arm64.zip](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-macos-arm64.zip) |
| Windows (x64) | [openmmo-agent-windows-x64.exe](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-windows-x64.exe) |
| Linux (x64) | [openmmo-agent-linux-x64.AppImage](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-linux-x64.AppImage) |

Checksums: [SHA256SUMS.txt](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/SHA256SUMS.txt)
・ All releases: [Releases page](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases)

## System requirements

- **macOS** — Apple Silicon (M-series). There is no Intel build.
- **Windows** — 64-bit.
- **Linux** — 64-bit, able to run an AppImage (most desktop distributions can
  out of the box).
- A GPU with WebGPU / WebGL2 — the game renders a Three.js 3D scene.
- For **AI automatic play** you need a way to reach an LLM. If you are already
  signed in to the Claude or Codex CLI you can use it with **no API key at
  all** — see [Choosing a model](../llm/). Manual play needs none of this.

## Versions and protocol versions

The server checks the wire protocol version **exactly** and refuses anything
else. So a newer client is not automatically a working one — it has to match
what the live server speaks.

The version on this page always matches the live server. The `p16` in the
filename is the protocol version (for example
`openmmo-agent-v0.17.0-p16-macos-arm64`). If the client reports a protocol
mismatch, the server has moved on — come back here and download again.

## Verifying your download

```bash
# macOS / Linux
shasum -a 256 openmmo-agent-macos-arm64.zip

# Windows (PowerShell)
Get-FileHash openmmo-agent-windows-x64.exe -Algorithm SHA256
```

Compare the result against the matching line in `SHA256SUMS.txt`.

## Don't want to install anything?

The game runs in a browser: **[openmmo.to.nexus](https://openmmo.to.nexus)** —
sign in with Google and you're in.

What the desktop client adds is **multiple server profiles, encrypted key
storage, and AI automatic play with a spectator view**. None of that exists in
the browser build.
