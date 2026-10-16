# AGENTS.md

## Cursor Cloud specific instructions

This is a single-product **Next.js 14 (App Router) + TypeScript** web app (`image-analysis-app`) — an AI-powered industrial safety / risk-assessment tool. Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`). Package manager is **npm** (`package-lock.json`).

### Services
- **Next.js dev server** is the only service. Run `npm run dev` (http://localhost:3000). API routes are Next.js route handlers (serverless on Vercel), not a separate backend.
- **Firebase Firestore** (project `airiska-1c12a`) is used by the `/board` community page. The client config is hardcoded in `app/lib/firebase.ts` and `firestore.rules` allows public read/write, so the board works with no local env setup — but note it talks to the **live** Firestore, so use clearly-labeled test data and clean up after yourself.

### Environment variables (none are committed; create `.env.local` if needed)
- `GOOGLE_GEMINI_API_KEY` — required at **runtime** for all AI features (`/camera`, `/assessment`, `/health-safety-plan`, and the `app/api/*` analysis routes via `app/lib/gemini.ts`). The dev server still starts without it; only the analysis API calls fail until it is set.
- `RESEND_API_KEY` — only for the `/api/contact` email form (optional). See build caveat below.
- `LAW_API_OC` (defaults to `'test'`), `ADMIN_EMAIL` — optional; degrade gracefully.

### Non-obvious caveats
- **`npm run build` fails without a Resend key.** `app/api/contact/route.ts` constructs `new Resend(process.env.RESEND_API_KEY)` at module load, and Resend throws if the key is missing during the "Collecting page data" build phase. To build, set any non-empty value, e.g. `RESEND_API_KEY=re_dummy_build_key npm run build`. The dev server is unaffected because routes compile on demand.
- **`npm run lint` prompts on first run.** There is no ESLint config committed, so `next lint` asks how to configure ESLint (a TTY prompt that hangs in non-interactive shells). To run lint non-interactively, create a temporary `.eslintrc.json` with `{ "extends": "next/core-web-vitals" }`, run `npm run lint`, then delete it. Do NOT commit that config: with it present, `next build` runs ESLint and fails on **pre-existing** lint errors in the codebase (e.g. `react/no-unescaped-entities` in `app/assessment/page.tsx` and `app/health-safety-plan/page.tsx`). Without it, `next build` skips linting (the repo's intended behavior).
- There is **no test framework** (no jest/vitest/playwright); end-to-end verification is manual via the browser.
- `app/lib/gemini.ts` uses `gemini-2.5-flash-lite` for both text and vision models.
