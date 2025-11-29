# AI Text Rewriter

Simple Next.js + TypeScript + Tailwind app that rewrites user text using OpenAI.

Prereqs:
- Node 18+ and npm
- An OpenAI API key

Setup

# AI Text Rewriter

A minimal Next.js + TypeScript + Tailwind app that rewrites user-provided text using the OpenAI API.

## Features

- Rewrites text to improve clarity, grammar, and style while preserving meaning
- Client-side word counter with a 250-word (~token) input limit
- Server-side API route that calls OpenAI Chat Completions

## Prerequisites

- Node 18+ and npm (or pnpm/yarn)
- An OpenAI API key

## Setup

1. Install dependencies

```bash
cd /Users/Rutul/Documents/NextJS/ai-text-rewriter
npm install
```

2. Create a `.env.local` file in the project root (or copy `.env.local.example`) and set your OpenAI key:

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment variables

- `OPENAI_API_KEY` (required): Your OpenAI API key.
- `OPENAI_MODEL` (optional): Model to use (`gpt-3.5-turbo` by default).

## Usage

- Paste up to ~250 words into the textarea and click **Rewrite Text**.
- The app estimates tokens from words; if your input exceeds the limit the UI will prevent submission.

## Implementation notes

- The app approximates token limits with a 250-word cap. For exact token counting consider adding a tokenizer (for example `tiktoken`) on the server and validating by tokens instead of words.
- The API route currently uses `fetch` to call the Chat Completions endpoint. You can switch to the official OpenAI Node SDK for improved ergonomics and streaming support.

## Troubleshooting

- If you see `OpenAI API key not configured` in the UI, ensure `.env.local` exists and `OPENAI_API_KEY` is set, then restart the dev server.
- Monitor your OpenAI usage to avoid unexpected charges.

## Security

- Do not commit `.env.local` or secrets to source control. `.gitignore` excludes local env files by default.

## Next steps (optional)

- Add token-accurate validation with `tiktoken`.
- Use the OpenAI Node SDK for easier request building and error handling.
- Add tests and linting (ESLint/Prettier) and CI pipeline.

---

Happy rewriting! If you'd like, I can start the dev server here and test a sample rewrite (requires your OpenAI key in `.env.local`).
