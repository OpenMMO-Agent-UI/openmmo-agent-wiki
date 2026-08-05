---
title: Choosing a model and AI settings
description: Which LLM to use for automatic play, what it costs, and what to avoid.
---

Automatic play needs an LLM. Skip this page if you only play manually.

## Where the settings are

**Settings** has four tabs: **LLM**, **Automatic play**, **Advanced**, and
**Actions**. Every field and its default is covered in
[Panel reference](../panel/).

## Pick a backend first

There are four, not just OpenRouter:

| Backend | Needs an API key? | Good if |
|---|---|---|
| **Codex CLI** | **No** — reuses the CLI you're already signed in to | You already use Codex |
| **Claude CLI** | **No** — same | You already use Claude Code |
| **OpenRouter** | Yes | You want the best cost/performance — see the measurements below |
| **OpenAI-compatible** | Depends on the endpoint | Local models (the default points at Ollama) or self-hosting |

**If you already have the Claude or Codex CLI, just pick that backend** — no
separate API key to set up.

To run entirely locally, choose **OpenAI-compatible** and put your Ollama
address in Base URL. No API cost and nothing leaves your machine — but local
models are usually slower and may not keep up with the game's turn cadence, so
raise Request timeout under Advanced.

## Which OpenRouter model

The bundled `scripts/bench-models.js` scores candidate models using the prompt
that actually ships, on two things: **do they keep track of what's really in
the bag**, and **do they give up on out-of-range targets**. Measured results
(cost is an estimate for 8 hours of continuous play):

| Model | Median response | Inventory | Distance | Cost / 8h |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`** (default) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

The default is `qwen/qwen3.7-flash`: it keeps both rules, answers in well under
a second, and costs a fraction of a frontier model — which is exactly what buys
the 8-second turn cadence the game wants.

Look at the bottom two: **cheap and completely failing.** They misremember the
bag and chase targets they can't reach. What that looks like in play is a
character standing around doing nothing useful.

:::caution[Avoid `:free`-suffixed routing]
Free routing measures queue time, not the model. `openai/gpt-oss-20b:free`
timed out at 51s where the same model on paid routing answered in 0.5s.
:::

## Running the benchmark yourself

To measure other models:

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

It prices against the live catalogue, so the numbers above move with provider
pricing.
