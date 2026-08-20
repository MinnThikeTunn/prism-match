# Store onboarding in the cloud database

Move onboarding answers out of the browser and into the cloud Postgres database, so they survive refreshes and can be read by the matching engine — while still letting anyone use the app without signing in, and letting the public browse profiles.

## How it works

1. On first visit the app creates an anonymous **device profile**: a random public id plus a secret device token kept in the browser.
2. Finishing onboarding saves two things:
   - **Public part** — display name, title, location, bio, avatar, goals, interests, availability, derived scores (execution / capability / resonance / color identity). Readable by everyone, signed in or not.
   - **Private part** — the raw questionnaire answers and sensitive constraints. Only reachable through the app's own server code with the matching device token; never exposed publicly.
3. Discovery and matching read the public table, so real people show up in the swipe deck on the published site instead of only mock data.
4. localStorage stays as an instant-load cache and offline fallback; the database is the source of truth. Existing local answers are uploaded once on first load after this change.
5. If real accounts are added later, a signed-in user can claim their device profile (a `claimed_by` field is reserved for that).

## Data model

- `anon_profiles` — public-safe columns + `public_data` JSONB, `token_hash` (hashed device token), `is_public` flag, `claimed_by`, timestamps.
  - `GRANT SELECT` to anon/authenticated, filtered to `is_public = true`; no direct client writes.
  - `GRANT ALL` to service_role.
- `anon_profile_features` — `profile_id`, `features` JSONB (raw answers), `completed`, timestamps.
  - No anon/authenticated grants at all; server-side access only.
- Existing `profiles` / `match_features` stay untouched for the future signed-in path.

## Technical notes

- Writes go through `createServerFn` handlers in `src/lib/onboarding.functions.ts`, using the service-role client loaded inside the handler. Every write verifies the device token against `token_hash` before touching a row, so one visitor can only edit their own profile.
- Reads of the public deck use a server publishable (anon) client behind the narrow `is_public = true` SELECT policy, with an explicit safe-column projection — no raw answers ever leave the server.
- Server functions: `ensureDeviceProfile`, `saveOnboarding`, `getMyOnboarding`, `listPublicProfiles`.
- `src/lib/onboardingStorage.ts` becomes a thin cache layer that mirrors the server response; `OnboardingQuestionnaire` and `App.tsx` call the server functions on completion.
- `DiscoveryView` merges real public profiles with the existing sample set so the deck is never empty.
- Rate-limit-ish safety: server functions validate input with Zod and cap payload size; no user input is written unvalidated.

## Steps

1. Migration: create the two tables, grants, RLS, policies, updated_at triggers.
2. Add `src/lib/onboarding.functions.ts` with the four server functions.
3. Add a device-identity helper (`src/lib/deviceIdentity.ts`) that creates/stores the id + token.
4. Wire onboarding completion and app bootstrap to load from / save to the cloud, with localStorage fallback.
5. Feed public profiles into Discovery.
6. Verify end-to-end in the preview: complete onboarding, hard-refresh, confirm answers reload from the database and the profile appears publicly in a fresh browser session.
