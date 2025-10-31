
# Fraction Trainer (Production-ready)

React + TypeScript + Vite + Tailwind, with tests (Vitest + Playwright), ESLint/Prettier,
CI (GitHub Actions), and ready for Vercel deployment.

## Features
- Practice single questions with keyboard shortcuts (Enter, N, S)
- Timed tests with custom sizes and target-time challenge
- Mixed numbers & negatives
- Show steps (clean stacked fractions, no slashes)
- Streaks & PBs (localStorage), reset metrics button
- Charts of past scores & times (Recharts)

## Getting started
```bash
npm ci
npm run dev
```

## Tests
```bash
npm run test         # unit/component
npm run e2e          # Playwright
```

## Lint & format
```bash
npm run lint
npm run format
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (Vercel)
1. Create a GitHub repo and push this project.
2. Go to Vercel → Import Project → pick the repo.
3. Framework: Vite. Build command: `npm run build`. Output dir: `dist/`.
4. Deploy. Share the Vercel URL with students.

## Notes
- No server needed; everything runs client-side with localStorage.
- To reset data, use the **Reset metrics** button in the header.
- Tailwind included for styling.
