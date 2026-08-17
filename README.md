# openmmo-agent-wiki

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support_this_project-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/dakywang)

[OpenMMO](https://github.com/OpenMMO-Agent-UI/OpenMMO) 攻略站,以及 OpenMMO Agent
桌面客戶端的下載與說明。

**網站:** https://openmmo-agent-ui.github.io/openmmo-agent-wiki/

## 下載 OpenMMO Agent

以下連結永遠指向最新版本:

| 平台 | 下載 |
|---|---|
| macOS (Apple Silicon) | [openmmo-agent-v0.28.0-p29-macos-arm64.zip](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-v0.28.0-p29-macos-arm64.zip) |
| Windows (x64) | [openmmo-agent-v0.28.0-p29-windows-x64.exe](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-v0.28.0-p29-windows-x64.exe) |
| Linux (x64) | [openmmo-agent-v0.28.0-p29-linux-x64.AppImage](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-v0.28.0-p29-linux-x64.AppImage) |

版本與遊戲協議相容性見[最新 release](https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest),
完整安裝步驟見[安裝指南](https://openmmo-agent-ui.github.io/openmmo-agent-wiki/client/install/)。
下載後可用同時發佈的 `SHA256SUMS.txt` 校驗。

OpenMMO Agent 是自由開源軟體(MIT)。覺得好玩的話,歡迎
[請開發者喝杯咖啡](https://ko-fi.com/dakywang) ☕ —— 有助於支付簽署憑證費用,
讓開發持續下去。

## 開發

```bash
npm install
npm run dev      # http://localhost:4321/openmmo-agent-wiki/
npm run build    # 輸出到 dist/
```

## 部署

推到 `main` 就會由 `.github/workflows/deploy.yml` 建置並發佈到 GitHub Pages。
Pages 來源設定為 **GitHub Actions**(不是分支)。

## 客戶端安裝檔

安裝檔以 **GitHub Release 資產**的形式發佈在這個 repo,不進版本庫 ——
單檔超過 GitHub 的 100MB 上限,走 Git LFS 會產生流量費用。
`openmmo-agent-ui` 的發佈流程建置完成後上傳到這裡,只保留最新版本。

檔名帶完整版本與協議號(`openmmo-agent-v<版本>-p<協議>-<平台>`),
玩家下載後看檔名就知道自己拿的是哪一版。發新版時,`publish-downloads`
流程會自動改寫 `src/data/release.json`(網站下載頁由它產生連結)
和這個 README 裡的檔名,推上來後網站自動重建 —— 一樣不需要人工改動。

## 結構

```
src/content/docs/
  index.mdx           首頁
  client/             桌面客戶端:下載、安裝、模型選擇
  database/           遊戲資料庫,由 CSV 產生表格
  updates/            更新日誌,以協議版本為主軸
src/data/game/        上游 data-src/*.csv 的副本
src/lib/gamedata.js   CSV 解析、推算值、貨幣換算
src/lib/zh.js         道具與怪物的中文名稱
src/components/       FilterTable(可篩選表格)
scripts/              資料同步
astro.config.mjs      站台設定、i18n、側邊欄
```

繁體中文為主要語言(根路徑),英文位於 `/en/`,尚未翻譯的頁面會回退到中文。

## 遊戲資料

資料庫頁面的數值來自上游 `data-src/*.csv`,以副本形式放在 `src/data/game/`,
建置時用 `?raw` 內聯進去 —— 網站因此可以離線建置,不依賴 GitHub 可達。

```bash
node scripts/sync-gamedata.mjs   # 從上游拉最新 CSV,再 review + commit
```

## 漂移偵測

本站描述兩個自己控制不了的東西:線上遊戲伺服器,以及上游的遊戲資料。
兩者都無預警變動過,其中一次讓下載連結提供了伺服器會拒絕的客戶端。

`.github/workflows/check-drift.yml` 每天檢查一次:

```bash
node --experimental-websocket scripts/check-drift.mjs   # Node 22 起不需要旗標
```

1. 用一個必定過期的版本對 `wss://openmmo.to.nexus/ws` 握手 ——
   伺服器的拒絕訊息會直接說出它要求的協議版本
2. 比對 wiki 最新 release 的協議版本
3. 比對 `src/data/game/` 與上游 `data-src/`

有落差就開(或更新)一個 issue,落差消失時自動關閉 ——
一直掛著的舊 issue 只會訓練人忽略下一個。

`src/lib/gamedata.js` 做兩件 CSV 本身沒有的事:

1. **補推算值** —— 怪物的生命、命中加值、傷害骰留空代表「不覆寫」,
   伺服器依等級計算。這裡照 `server/src/game/combat.rs` 的公式補上,
   頁面會用 `*` 標示哪些是推算的。
2. **換算貨幣** —— 遊戲內部只存一個銅幣整數,
   1 金 = 100 銀 = 10,000 銅 屬於顯示層慣例。

上游改動資料結構(欄位增刪)時,除了重跑同步腳本,也要檢查這兩處。
