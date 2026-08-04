---
title: 選擇模型與 AI 設定
description: 自動遊玩要用哪個 LLM、成本大概多少,以及該避開什麼。
---

自動遊玩需要一組 LLM API key。手動遊玩不需要,可以跳過這頁。

## 設定在哪裡

**Settings** 有四個頁籤:**LLM**、**Automatic play**、**Advanced**、**Actions**。
每一項的預設值與作用見[面板功能詳解](../panel/)。

## 先決定用哪種後端

有四種,不是只有 OpenRouter:

| 後端 | 要不要 API key | 適合 |
|---|---|---|
| **Codex CLI** | 不用 —— 直接用本機已登入的 CLI | 已經在用 Codex 的人 |
| **Claude CLI** | 不用 —— 同上 | 已經在用 Claude Code 的人 |
| **OpenRouter** | 要 | 想要最好的性價比,見下方實測 |
| **OpenAI 相容** | 看端點 | 接本地模型(預設指向 Ollama)或自架服務 |

**已經有 Claude 或 Codex CLI 的話,直接選 CLI 後端就好** —— 不用再辦一組 API key。

想完全本地跑就選 OpenAI 相容,Base URL 填 Ollama 位址。沒有 API 費用、
資料不出機器,代價是本地模型多半較慢,可能追不上遊戲的回合節奏
(記得把 Advanced 的 Request timeout 調大)。

## OpenRouter 該用哪個模型

客戶端內附的 `scripts/bench-models.js` 會用實際出貨的提示詞測試候選模型,
評分兩件事:**是否記得住背包裡實際有什麼**,以及**是否會放棄超出範圍的目標**。
以下是實測結果(成本欄是連續遊玩 8 小時的估算):

| 模型 | 回應中位數 | 背包正確 | 距離判斷 | 8 小時成本 |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`**(預設) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

預設是 `qwen/qwen3.7-flash`:兩項規則都守得住、回應遠低於一秒,
成本只有前沿模型的零頭 —— 而這正是遊戲需要的 8 秒回合節奏所仰賴的。

注意最後兩個模型:**便宜但完全不及格**。它們會記錯背包內容、
追著打不到的目標,實際體驗是角色在原地做無意義的事。

:::caution[避開 `:free` 結尾的路由]
免費路由測到的是排隊時間,不是模型本身的速度。
實測 `openai/gpt-oss-20b:free` 逾時 51 秒,而同一個模型走付費路由只要 0.5 秒。
:::

## 自己跑一次評測

如果想測其他模型:

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

它會用即時的價目表計算成本,所以上表的數字會隨供應商調價而變動。
