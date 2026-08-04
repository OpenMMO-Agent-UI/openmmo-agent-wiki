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
  updates/            更新日誌,以協議版本為主軸
astro.config.mjs      站台設定、i18n、側邊欄
```

繁體中文為主要語言(根路徑),英文位於 `/en/`,尚未翻譯的頁面會回退到中文。
