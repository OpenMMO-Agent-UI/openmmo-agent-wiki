---
title: 'Choisir un modèle et les réglages IA'
description: 'Quel LLM utiliser pour le jeu automatique, ce qu''il coûte, et ce qu''il faut éviter.'
---

Le jeu automatique a besoin d'un LLM. Passez cette page si vous ne jouez qu'en manuel.

## Où sont les réglages

**Réglages** comporte quatre onglets : **LLM**, **Jeu automatique**, **Avancé** et **Actions**. Chaque champ et sa valeur par défaut sont décrits dans la [référence du panneau](../panel/).

## Choisissez d'abord un backend

Il y en a quatre, pas seulement OpenRouter :

| Backend | Clé API nécessaire ? | Bon choix si |
|---|---|---|
| **Codex CLI** | **Non** — réutilise la CLI où vous êtes déjà connecté | Vous utilisez déjà Codex |
| **Claude CLI** | **Non** — pareil | Vous utilisez déjà Claude Code |
| **OpenRouter** | Oui | Vous voulez le meilleur rapport coût/performance — voir les mesures ci-dessous |
| **OpenAI-compatible** | Selon l'endpoint | Modèles locaux (le défaut pointe vers Ollama) ou auto-hébergement |

**Si vous avez déjà la CLI Claude ou Codex, choisissez simplement ce backend** — aucune clé API distincte à configurer.

Pour tout faire tourner en local, choisissez **OpenAI-compatible** et mettez l'adresse de votre Ollama dans Base URL. Aucun coût d'API et rien ne quitte votre machine — mais les modèles locaux sont généralement plus lents et peuvent ne pas suivre la cadence des tours du jeu, alors augmentez le délai d'attente des requêtes dans Avancé.

## Quel modèle OpenRouter

Le `scripts/bench-models.js` fourni note les modèles candidats avec le prompt réellement livré, sur deux points : **suivent-ils vraiment ce qu'il y a dans le sac**, et **renoncent-ils aux cibles hors de portée**. Résultats mesurés (le coût est une estimation pour 8 heures de jeu continu) :

| Modèle | Réponse médiane | Inventaire | Distance | Coût / 8 h |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`** (par défaut) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

Le défaut est `qwen/qwen3.7-flash` : il respecte les deux règles, répond bien en dessous de la seconde et coûte une fraction d'un modèle de pointe — c'est exactement ce qui achète la cadence de 8 secondes par tour que le jeu attend.

Regardez les deux du bas : **pas chers et en échec complet.** Ils se trompent sur le contenu du sac et poursuivent des cibles inatteignables. En jeu, cela donne un personnage planté là à ne rien faire d'utile.

:::caution[Évitez le routage suffixé `:free`]
Le routage gratuit mesure le temps d'attente, pas le modèle. `openai/gpt-oss-20b:free` a expiré à 51 s là où le même modèle en routage payant a répondu en 0,5 s.
:::

## Lancer le banc d’essai vous-même

Pour mesurer d'autres modèles :

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

Il calcule les prix sur le catalogue en direct, donc les chiffres ci-dessus bougent avec la tarification des fournisseurs.
