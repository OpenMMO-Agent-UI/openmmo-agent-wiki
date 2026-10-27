---
title: 'Memilih model dan pengaturan AI'
description: 'LLM mana yang dipakai untuk main otomatis, berapa biayanya, dan apa yang perlu dihindari.'
---

Main otomatis butuh LLM. Lewati halaman ini kalau kamu hanya bermain manual.

## Di mana pengaturannya

**Pengaturan** punya empat tab: **LLM**, **Main otomatis**, **Lanjutan**, dan **Aksi**. Setiap kolom dan nilai bawaannya dijelaskan di [referensi panel](../panel/).

## Pilih backend lebih dulu

Ada empat, bukan cuma OpenRouter:

| Backend | Perlu kunci API? | Cocok kalau |
|---|---|---|
| **Codex CLI** | **Tidak** — memakai ulang CLI yang sudah kamu masuki | Kamu sudah memakai Codex |
| **Claude CLI** | **Tidak** — sama | Kamu sudah memakai Claude Code |
| **OpenRouter** | Ya | Kamu mau rasio biaya/performa terbaik — lihat pengukuran di bawah |
| **OpenAI-compatible** | Tergantung endpoint | Model lokal (bawaannya mengarah ke Ollama) atau hosting sendiri |

**Kalau kamu sudah punya CLI Claude atau Codex, pilih backend itu saja** — tidak ada kunci API terpisah yang perlu disiapkan.

Untuk berjalan sepenuhnya lokal, pilih **OpenAI-compatible** dan masukkan alamat Ollama-mu di Base URL. Tanpa biaya API dan tidak ada yang keluar dari mesinmu — tapi model lokal umumnya lebih lambat dan mungkin tidak mengejar irama giliran gim, jadi naikkan batas waktu permintaan di Lanjutan.

## Model OpenRouter yang mana

`scripts/bench-models.js` yang disertakan menilai model kandidat memakai prompt yang benar-benar dikirim, atas dua hal: **apakah mereka mengikuti isi tas dengan benar**, dan **apakah mereka melepas sasaran di luar jangkauan**. Hasil pengukuran (biaya adalah perkiraan untuk 8 jam bermain terus-menerus):

| Model | Respons median | Inventaris | Jarak | Biaya / 8 jam |
|---|---|---|---|---|
| **`qwen/qwen3.7-flash`** (bawaan) | 0.7s | 3/3 | 3/3 | **$0.60** |
| `openai/gpt-oss-20b` | 0.5s | 3/3 | 3/3 | $0.86 |
| `anthropic/claude-haiku-4.5` | 1.5s | 3/3 | 3/3 | $14.34 |
| `mistralai/mistral-nemo` | 0.3s | 0/3 | 0/3 | $0.23 |
| `inclusionai/ling-2.6-flash` | 0.7s | 0/3 | 1/3 | $0.14 |

Bawaannya `qwen/qwen3.7-flash`: memenuhi kedua aturan, menjawab jauh di bawah satu detik, dan biayanya sepersekian model papan atas — itulah yang membeli irama 8 detik per giliran yang diinginkan gim.

Lihat dua yang paling bawah: **murah dan gagal total.** Mereka salah mengingat isi tas dan mengejar sasaran yang tak terjangkau. Saat dimainkan, itu tampak sebagai karakter yang berdiri saja tanpa melakukan apa pun yang berguna.

:::caution[Hindari routing berakhiran `:free`]
Routing gratis mengukur waktu antrean, bukan modelnya. `openai/gpt-oss-20b:free` kehabisan waktu di 51 detik sementara model yang sama pada routing berbayar menjawab dalam 0,5 detik.
:::

## Menjalankan benchmark sendiri

Untuk mengukur model lain:

```bash
OPENROUTER_API_KEY=sk-or-... node scripts/bench-models.js
```

Harga dihitung terhadap katalog langsung, jadi angka di atas bergerak mengikuti harga penyedia.
