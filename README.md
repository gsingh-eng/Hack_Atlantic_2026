# Veritas

Hack Atlantic 2026. Two people tell their side of a small money fight. An AI judge hears both and writes a decision.

This is a booth demo. It is not a real court and not legal advice.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## So far

Welcome, queue, booking, setup, live hearing, and a written Gemini judgment. The header has EN / FR for the UI. Copy `.env.example` to `.env` and add a Gemini key. Do not commit `.env`.

## Keys

`VITE_GEMINI_API_KEY` is required for the written decision. Do not commit `.env`.
