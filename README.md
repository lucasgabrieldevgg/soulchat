# ✦ SoulChat

> Narração viva com IA — você interfere, a história se adapta. Sucessor do *Contador de Histórias*.

**Jogue agora:** https://lucasgabrieldevgg.github.io/soulchat

Um arquivo só, zero instalação, roda no navegador (desktop e celular). A IA já vem funcionando de fábrica — não precisa criar conta nem colar chave nenhuma.

## O que faz

- **📖 Nova história** — universo + premissa; o narrador conduz e oferece escolhas com prós e contras a cada cena
- **🎭 Com personagem** — preencha a ficha do zero, cole uma pronta, ou digite só o nome e deixe a **🔎 pesquisa preencher tudo** (incluindo a foto, puxada da Wikipédia)
- **⚡ Modificadores** — 10 estilos (mais diálogo, ação, romance, humor, terror, slow burn, sensorial, 1ª pessoa, épico, respostas curtas) + crie os seus. Liga/desliga no meio da conversa
- **📜 Chatlog mestre** — a IA mantém um resumo vivo da história e o relê antes de responder: a memória não "estoura" em histórias longas
- **🔍 Pesquisa funda** — Wikipédia + Wikidata em **qualquer idioma** (a IA escolhe idioma e estratégia e para quando já tem a informação). 3 níveis: ⚡ Rápida · 🎯 Padrão · 🌍 Completa
- **🔊 Voz**, **⬇️ export .txt**, códigos inline (`*ação*`, `"fala"`, `(OOC:)`, `!opcoes`, `!tom`, `!lembrar:`, `!pesquisar:`, `!resumo`…) e **⌨️ legenda sempre à mão**

## IA e privacidade

- **Sem chave exposta**: o site chama o proxy **soulchat-proxy.vercel.app** (Edge Function na Vercel), que guarda as chaves em segredo no servidor
- **Fila automática**: proxy→OpenRouter (Gemma 4 26B grátis) → proxy→NVIDIA (GPT-OSS 20B) → Pollinations
- Quer usar a SUA chave? ⚙️ → cole (OpenRouter/NVIDIA) — entra na frente da fila e fica só no seu navegador
- História e configurações ficam no `localStorage` do seu navegador. Nada de rastreamento.

## Stack

HTML/CSS/JS num arquivo único · APIs públicas da Wikipédia/Wikidata (CORS liberado, grátis) · Edge Function na Vercel (plano Hobby) · GitHub Pages

---

Feito para narrar. ✦
