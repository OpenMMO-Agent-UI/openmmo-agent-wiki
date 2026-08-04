---
title: 下載 OpenMMO Agent
description: OpenMMO Agent 桌面客戶端的下載連結、系統需求與檔案校驗值。
---

OpenMMO Agent 是一個桌面客戶端,可以**手動遊玩**,也可以設定一個 LLM
**替你的角色行動**,你在旁邊即時觀看它的視角與思考過程。

:::caution[所有版本皆未經簽章]
安裝檔沒有經過 Apple 或 Microsoft 的簽章,系統會跳出警告。
這是預期行為 —— 請照[安裝與首次啟動](../install/)的步驟繞過,不要直接按「取消」。
:::

## 下載

以下連結永遠指向最新版本:

| 平台 | 檔案 |
|---|---|
| macOS (Apple Silicon) | [openmmo-agent-macos-arm64.zip](https://github.com/OpenMMO-agent/openmmo-agent-wiki/releases/latest/download/openmmo-agent-macos-arm64.zip) |
| Windows (x64) | [openmmo-agent-windows-x64.exe](https://github.com/OpenMMO-agent/openmmo-agent-wiki/releases/latest/download/openmmo-agent-windows-x64.exe) |
| Linux (x64) | [openmmo-agent-linux-x64.AppImage](https://github.com/OpenMMO-agent/openmmo-agent-wiki/releases/latest/download/openmmo-agent-linux-x64.AppImage) |

校驗值:[SHA256SUMS.txt](https://github.com/OpenMMO-agent/openmmo-agent-wiki/releases/latest/download/SHA256SUMS.txt)
・ 所有版本:[Releases 頁面](https://github.com/OpenMMO-agent/openmmo-agent-wiki/releases)

## 系統需求

- **macOS** — Apple Silicon (M 系列)。目前沒有 Intel 版本。
- **Windows** — 64 位元。
- **Linux** — 64 位元,需要能執行 AppImage(多數桌面發行版預設可以)。
- 顯示卡需支援 WebGPU / WebGL2 —— 遊戲畫面是 Three.js 的 3D 場景。
- 若要使用 **AI 自動遊玩**,需要一組 LLM API key(建議 OpenRouter),
  費用另計 —— 見[選擇模型](../llm/)。手動遊玩不需要。

## 版本與協議版本

伺服器會**精確比對**通訊協議版本,不符就直接拒絕連線。
所以客戶端不是「越新越好」,而是必須與線上伺服器當前的協議版本相符。

下載頁上的版本永遠是與正式伺服器相符的版本。檔名裡的 `p16` 就是協議版本
(例如 `openmmo-agent-v0.17.0-p16-macos-arm64`)。如果客戶端啟動後顯示協議
不符,代表伺服器已經更新 —— 回來這裡重新下載即可。

## 驗證下載檔案

```bash
# macOS / Linux
shasum -a 256 openmmo-agent-macos-arm64.zip

# Windows (PowerShell)
Get-FileHash openmmo-agent-windows-x64.exe -Algorithm SHA256
```

比對結果與 `SHA256SUMS.txt` 中對應的那一行是否一致。

## 不想安裝?

遊戲本身可以直接在瀏覽器玩:**[openmmo.to.nexus](https://openmmo.to.nexus)**,
用 Google 帳號登入即可。桌面客戶端提供的是**多伺服器設定檔、加密金鑰保存,
以及 AI 自動遊玩與觀戰**,這些瀏覽器版沒有。
