[🇧🇷 Português](README.pt-BR.md)

# ✦ SoulChat

[![tests](https://github.com/lucasgabrieldevgg/soulchat/actions/workflows/ci.yml/badge.svg)](https://github.com/lucasgabrieldevgg/soulchat/actions/workflows/ci.yml)

> Living AI narration — you steer, the story adapts. Successor to *Contador de Histórias*.

## 🌐 Play now
**https://lucasgabrieldevgg.github.io/soulchat** — no account, no key: AI works out of the box. Your progress stays in your browser.

One single file, zero install, runs in the browser (desktop and mobile). AI comes working out of the box — no sign-up, no pasting keys.

## Features

- **📖 New story** — universe + premise; the narrator leads the scene and offers choices with pros and cons
- **🎭 With a character** — fill the sheet from scratch, paste a ready one, or type just a name and let the **🔎 search fill it all in** (including the photo, pulled from Wikipedia)
- **⚡ Modifiers** — 10 styles (more dialogue, action, romance, humor, horror, slow burn, sensory, 1st person, epic, short replies) + create your own. Toggle mid-conversation
- **📜 Master chatlog** — the AI keeps a living summary of the story and re-reads it before replying: memory doesn't "blow up" on long stories
- **🔍 Deep search** — Wikipedia + Wikidata in **any language** (the AI picks language and strategy and stops once it has the answer). 3 levels: ⚡ Quick · 🎯 Standard · 🌍 Full
- **🔊 Voice**, **⬇️ .txt export**, inline codes (`*action*`, `"speech"`, `(OOC:)`, `!options`, `!tone`, `!remember:`, `!search:`, `!summary`…) and **⌨️ captions always at hand**

## AI & privacy

- **No exposed keys**: the site calls the **soulchat-proxy.vercel.app** proxy (Vercel Edge Function), which keeps the keys server-side
- **Automatic queue**: proxy→OpenRouter (free Gemma 4 26B) → proxy→NVIDIA (GPT-OSS 20B) → Pollinations
- Want to use YOUR key? ⚙️ → paste it (OpenRouter/NVIDIA) — it jumps the queue and stays in your browser only
- Story and settings live in your browser's `localStorage`. No tracking.

## Stack

HTML/CSS/JS in a single file · public Wikipedia/Wikidata APIs (CORS enabled, free) · Vercel Edge Function (Hobby plan) · GitHub Pages

---

Built to narrate. ✦

## License

MIT — see [LICENSE](LICENSE).
