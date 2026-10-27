---
title: 'Elegir un modelo y la configuración de IA'
description: 'Qué LLM usar para el juego automático, cuánto cuesta y qué evitar.'
---

El juego automático necesita un LLM. Salta esta página si solo juegas manualmente.

## Dónde están los ajustes

**Ajustes** tiene cuatro pestañas: **LLM**, **Juego automático**, **Avanzado** y **Acciones**. Cada campo y su valor por defecto se describen en la [referencia del panel](../panel/).

## Elige primero un backend

Hay cuatro, no solo OpenRouter:

| Backend | ¿Necesita clave de API? | Conviene si |
|---|---|---|
| **Codex CLI** | **No** — reutiliza la CLI en la que ya iniciaste sesión | Ya usas Codex |
| **Claude CLI** | **No** — igual | Ya usas Claude Code |
| **OpenRouter** | Sí | Quieres la mejor relación coste/rendimiento — mira las mediciones de abajo |
| **OpenAI-compatible** | Depende del endpoint | Modelos locales (por defecto apunta a Ollama) o alojamiento propio |

**Si ya tienes la CLI de Claude o de Codex, elige ese backend y basta**: no hay ninguna clave de API que configurar aparte.

Para funcionar enteramente en local, elige **OpenAI-compatible** y pon la dirección de Ollama en Base URL. Sin coste de API y nada sale de tu máquina, pero los modelos locales suelen ser más lentos y puede que no sigan el ritmo de turnos del juego, así que aumenta el tiempo de espera de las peticiones en Avanzado.

## Qué modelo de OpenRouter

El `scripts/bench-models.js` incluido puntúa modelos candidatos con el prompt que realmente se distribuye, sobre dos cosas: **si llevan bien la cuenta de lo que hay en la bolsa** y **si renuncian a objetivos fuera de alcance**. Resultados medidos (el coste es una estimación para 8 horas de juego continuo):

| Modelo | Respuesta mediana | Inventario | Distancia | Coste / 8 h |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`** (por defecto) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

El valor por defecto es `qwen/qwen3.7-flash`: cumple ambas reglas, responde muy por debajo del segundo y cuesta una fracción de un modelo de frontera, que es exactamente lo que compra el ritmo de 8 segundos por turno que el juego quiere.

Mira los dos de abajo: **baratos y fallando por completo.** Recuerdan mal la bolsa y persiguen objetivos a los que no pueden llegar. Lo que eso parece al jugar es un personaje quieto sin hacer nada útil.

:::caution[Evita el enrutado con sufijo `:free`]
El enrutado gratuito mide el tiempo de cola, no el modelo. `openai/gpt-oss-20b:free` agotó el tiempo a los 51 s donde el mismo modelo en enrutado de pago respondió en 0,5 s.
:::

## Ejecutar la prueba tú mismo

Para medir otros modelos:

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

Calcula los precios contra el catálogo en vivo, así que los números de arriba se mueven con los precios del proveedor.
