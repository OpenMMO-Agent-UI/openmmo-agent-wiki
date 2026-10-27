---
title: 'Escolher um modelo e as configurações de IA'
description: 'Qual LLM usar no jogo automático, quanto custa e o que evitar.'
---

O jogo automático precisa de um LLM. Pule esta página se você só joga manualmente.

## Onde ficam as configurações

**Configurações** tem quatro abas: **LLM**, **Jogo automático**, **Avançado** e **Ações**. Cada campo e seu padrão estão descritos na [referência do painel](../panel/).

## Escolha primeiro um backend

São quatro, não apenas o OpenRouter:

| Backend | Precisa de chave de API? | Bom se |
|---|---|---|
| **Codex CLI** | **Não** — reaproveita a CLI em que você já está autenticado | Você já usa o Codex |
| **Claude CLI** | **Não** — o mesmo | Você já usa o Claude Code |
| **OpenRouter** | Sim | Você quer a melhor relação custo/desempenho — veja as medições abaixo |
| **OpenAI-compatible** | Depende do endpoint | Modelos locais (o padrão aponta para o Ollama) ou hospedagem própria |

**Se você já tem a CLI do Claude ou do Codex, basta escolher esse backend** — não há chave de API separada para configurar.

Para rodar inteiramente local, escolha **OpenAI-compatible** e coloque o endereço do seu Ollama em Base URL. Sem custo de API e nada sai da sua máquina — mas modelos locais costumam ser mais lentos e podem não acompanhar a cadência de turnos do jogo, então aumente o tempo limite das requisições em Avançado.

## Qual modelo do OpenRouter

O `scripts/bench-models.js` incluído pontua modelos candidatos com o prompt que realmente é distribuído, em duas coisas: **se acompanham o que de fato está na bolsa** e **se desistem de alvos fora de alcance**. Resultados medidos (o custo é uma estimativa para 8 horas de jogo contínuo):

| Modelo | Resposta mediana | Inventário | Distância | Custo / 8 h |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`** (padrão) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

O padrão é `qwen/qwen3.7-flash`: cumpre as duas regras, responde bem abaixo de um segundo e custa uma fração de um modelo de ponta — que é exatamente o que compra a cadência de 8 segundos por turno que o jogo quer.

Olhe os dois de baixo: **baratos e falhando por completo.** Erram o conteúdo da bolsa e perseguem alvos que não alcançam. Na prática isso aparece como um personagem parado sem fazer nada de útil.

:::caution[Evite roteamento com sufixo `:free`]
O roteamento gratuito mede tempo de fila, não o modelo. `openai/gpt-oss-20b:free` estourou o tempo em 51 s onde o mesmo modelo em roteamento pago respondeu em 0,5 s.
:::

## Rodar o benchmark você mesmo

Para medir outros modelos:

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

Ele calcula preços contra o catálogo ao vivo, então os números acima mudam com o preço dos provedores.
