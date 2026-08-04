# openmmo-agent-wiki

[OpenMMO](https://github.com/OpenMMO-Agent-UI/OpenMMO) 攻略站,以及 OpenMMO Agent
桌面客戶端的下載與說明。

**網站:** https://openmmo-agent-ui.github.io/openmmo-agent-wiki/

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
`openmmo-client`(私有)的發佈流程建置完成後上傳到這裡,只保留最新版本。

網站上的下載連結使用不含版本號的固定檔名:

```
https://github.com/OpenMMO-Agent-UI/openmmo-agent-wiki/releases/latest/download/openmmo-agent-macos-arm64.zip
```

這樣發新版時網站不需要任何改動。

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

`src/lib/gamedata.js` 做兩件 CSV 本身沒有的事:

1. **補推算值** —— 怪物的生命、命中加值、傷害骰留空代表「不覆寫」,
   伺服器依等級計算。這裡照 `server/src/game/combat.rs` 的公式補上,
   頁面會用 `*` 標示哪些是推算的。
2. **換算貨幣** —— 遊戲內部只存一個銅幣整數,
   1 金 = 100 銀 = 10,000 銅 屬於顯示層慣例。

上游改動資料結構(欄位增刪)時,除了重跑同步腳本,也要檢查這兩處。
