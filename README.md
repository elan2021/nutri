# NutriAI — Next.js

Versão Next.js (App Router) do app de avaliação nutricional.

## O que mudou em relação ao artifact original

1. **API key segura.** A chamada para `api.anthropic.com` foi movida do browser para rotas server-side (`app/api/extract` e `app/api/diagnose`). A chave fica em `.env.local` e nunca é enviada ao cliente.
2. **Estrutura de projeto.** Componente único virou `app/components/NutriAI.jsx` (client component) + `app/page.jsx` + duas rotas de API.
3. **CSS variables.** As variáveis que o ambiente do artifact fornecia (`--color-text-primary`, etc.) agora estão definidas em `app/globals.css`, com suporte a dark mode.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edite .env.local e coloque sua chave em ANTHROPIC_API_KEY
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
app/
├── api/
│   ├── extract/route.js     # POST → extrai dados de imagem com Claude
│   └── diagnose/route.js    # POST → gera avaliação nutricional
├── components/
│   └── NutriAI.jsx          # componente principal ("use client")
├── globals.css              # CSS variables + reset
├── layout.jsx               # root layout
└── page.jsx                 # renderiza <NutriAI />
```

## Pontos de atenção

- O input aceita `application/pdf`, mas a API da Anthropic via base64 com `media_type: image/...` só aceita imagens. Para PDFs, ou converta o PDF em imagem antes, ou use o tipo `document` da Anthropic (precisa ajustar a rota `/api/extract` para detectar PDF e enviar como `{ type: "document", source: { type: "base64", media_type: "application/pdf", data } }`).
- Considere adicionar rate limiting nas rotas de API (ex: `@upstash/ratelimit`) se for expor publicamente — a chave está protegida, mas o custo das chamadas não.
- Para deploy na Vercel, basta adicionar `ANTHROPIC_API_KEY` nas environment variables do projeto.
