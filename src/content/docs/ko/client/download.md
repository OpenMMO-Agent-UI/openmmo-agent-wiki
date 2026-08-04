---
title: OpenMMO Agent 다운로드
description: OpenMMO Agent 데스크톱 클라이언트의 다운로드 링크, 시스템 요구사항, 체크섬.
---

OpenMMO Agent는 데스크톱 클라이언트입니다. **직접 플레이**할 수도 있고,
LLM을 설정해 **캐릭터를 대신 움직이게** 하고 그 시점과 사고 과정을 실시간으로
지켜볼 수도 있습니다.

:::caution[모든 빌드는 서명되어 있지 않습니다]
설치 파일에 Apple/Microsoft 서명이 없어 경고가 뜹니다.
정상적인 동작이니 [설치와 첫 실행](../install/)의 절차대로 통과시키세요.
그냥 「취소」를 누르지 마세요.
:::

## 다운로드

아래 링크는 항상 최신 버전을 가리킵니다:

| 플랫폼 | 파일 |
|---|---|
| macOS (Apple Silicon) | [openmmo-agent-macos-arm64.zip](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-macos-arm64.zip) |
| Windows (x64) | [openmmo-agent-windows-x64.exe](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-windows-x64.exe) |
| Linux (x64) | [openmmo-agent-linux-x64.AppImage](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-linux-x64.AppImage) |

체크섬: [SHA256SUMS.txt](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/SHA256SUMS.txt)
・ 모든 버전: [Releases 페이지](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases)

## 시스템 요구사항

- **macOS** — Apple Silicon (M 시리즈). Intel 빌드는 없습니다.
- **Windows** — 64비트.
- **Linux** — 64비트, AppImage 실행 가능 환경(대부분의 데스크톱 배포판은 기본 지원).
- WebGPU / WebGL2를 지원하는 그래픽 — 게임 화면은 Three.js 기반 3D입니다.
- **AI 자동 플레이**를 쓰려면 LLM 접근 수단이 필요합니다. 이미 Claude 또는 Codex CLI에
  로그인해 있다면 **API 키 없이** 그대로 쓸 수 있습니다 — [모델 선택](../llm/) 참고.
  수동 플레이만 할 거라면 아무것도 필요 없습니다.

## 버전과 프로토콜 버전

서버는 통신 프로토콜 버전을 **정확히** 대조하고, 맞지 않으면 접속을 거부합니다.
그래서 클라이언트는 「최신일수록 좋다」가 아니라 **현재 서버의 프로토콜과 일치해야**
합니다.

이 페이지의 버전은 항상 라이브 서버와 맞는 버전입니다. 파일명의 `p16`이 프로토콜
버전입니다(예: `openmmo-agent-v0.17.0-p16-macos-arm64`). 클라이언트가 프로토콜
불일치를 표시하면 서버가 업데이트된 것이니 여기서 다시 받으세요.

## 파일 검증

```bash
# macOS / Linux
shasum -a 256 openmmo-agent-macos-arm64.zip

# Windows (PowerShell)
Get-FileHash openmmo-agent-windows-x64.exe -Algorithm SHA256
```

결과를 `SHA256SUMS.txt`의 해당 줄과 비교하세요.

## 설치가 부담스럽다면

게임 자체는 브라우저에서 바로 할 수 있습니다:
**[openmmo.to.nexus](https://openmmo.to.nexus)** — Google 계정으로 로그인하면 끝입니다.

데스크톱 클라이언트가 더 주는 것은 **다중 서버 프로필, 암호화된 키 보관,
그리고 AI 자동 플레이와 관전**입니다. 브라우저판에는 없는 기능입니다.
