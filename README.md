# Matchwise Prism

Context-aware human matching platform. Deterministic 3-tier algorithm scoring, Prism Spectrum visualization, explainable AI synergy metrics.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4
- Express dev server + Vite middleware (`tsx server.ts`)
- `@google/genai` (Gemini 2.5 Flash) for natural-language criteria parsing
- Leaflet / OpenStreetMap for geo views
- `canvas-confetti`, `motion`, `lucide-react`

## Setup

Requires Node 18+. Bun also works (lockfile present).

```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY (optional, AI features only)
npm run dev            # http://localhost:3000
```

Without `GEMINI_API_KEY`, app runs with deterministic mock match pipeline.

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Vite + Express dev server, HMR |
| `npm run build` | Client bundle + server bundle (`dist/`) |
| `npm run start` | Run production bundle |
| `npm run preview` | Vite preview |
| `npm run lint` | `tsc --noEmit` type check |
| `npm run clean` | Remove `dist/` and `server.js` |

## Architecture

```
src/
├── components/        # React views (Dashboard, Maps, SynergyMatch, Profile, etc.)
├── lib/
│   ├── algorithm.ts   # Hard boundary gate G, confidence C, weighted score S
│   ├── colorSystem.ts # Chromatic archetype assessment
│   └── googleAuth.ts  # Google credential persistence
├── data/mockData.ts   # Seed profiles
└── types/index.ts     # UserProfile, MatchResult, CriteriaCard, ViewMode
server.ts              # Express + Vite middleware, /api/parse-custom-match
```

### Match Algorithm (`src/lib/algorithm.ts`)

Three-tier deterministic scoring:

1. **Hard Boundary Gate G** — {0,1}. Blocks on blocked-user list, language incompatibility. Fail = match rejected.
2. **System Confidence C** — [0,1]. Reduces on missing data, never touches final score directly.
3. **Weighted Score S** — multi-criteria (skills, drive, timezone, archetype fit) → rank.

AI layer: `/api/parse-custom-match` converts free-text prompt → `CriteriaCard` via Gemini. Used only as input to deterministic engine.

## Features

- Chromatic archetype test (modal onboarding, persisted in localStorage)
- Dashboard, Synergy Match, Profile, Maps (Leaflet/OSM), Verification views
- Custom AI Match: NL prompt → criteria schema → team builder
- Google auth modal + credential inspector (local-only)
- High-contrast accessibility toggle
- Prism Spectrum + Conic Ring visualizations

## Data

Mock profiles in `src/data/mockData.ts`. User profile + Google credential persisted in `localStorage` (`matchwise_user_profile`, `matchwise_google_cred`).

## Env

| Var | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | no | Enables `/api/parse-custom-match` AI parsing |

## Notes

- No backend persistence. All state client-side or in-memory.
- Server = dev/prod entrypoint only. AI calls proxied through Express to keep `GEMINI_API_KEY` server-side.
- TypeScript strict via `tsc --noEmit` (lint script).
