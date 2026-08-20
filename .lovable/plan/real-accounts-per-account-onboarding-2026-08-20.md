# Real accounts + per-account onboarding

Right now there is no real login. The "Google" sign-in is a mocked demo picker, the profile lives in `localStorage`, and onboarding completion is a local flag tied to the browser (a device token), not to a person. So a "new account" still sees the same profile and skips onboarding.

This change makes onboarding a property of the account, stored in the cloud database.

## What you'll get

- An email/password sign-up and sign-in screen at `/auth` (confirm-by-email by default).
- The app itself requires being signed in. Signing out returns you to `/auth`.
- Right after a brand-new account signs in for the first time, the 10-step onboarding questionnaire opens automatically and cannot be skipped away permanently — it reopens until finished.
- Answers and the derived profile (scores, OCEAN traits, bio, offers/needs) are saved to your account in the cloud database. No `localStorage` for profile or onboarding state.
- Sign out, create a second account, and you get a clean onboarding run — because completion is stored per account.
- Existing anonymous profiles stay visible in Discovery as sample candidates.
- The mocked Google account picker and credential inspector are removed.

## How it works

**Database**
- Add `onboarding_completed boolean not null default false` to `profiles` so completion is per user.
- `match_features` (already exists, keyed by `user_id`) stores the raw questionnaire answers; `profiles.profile_data` stores the derived profile.
- The existing `handle_new_user` trigger already creates a `profiles` row on signup, so a new account starts with `onboarding_completed = false` and empty features.

**Routing**
- New public `src/routes/auth.tsx`: sign-up / sign-in form using email + password, with `emailRedirectTo: window.location.origin`, plus a forgot-password link and a `src/routes/reset-password.tsx` page.
- Move the app shell under the managed `_authenticated` layout at `src/routes/_authenticated/app.tsx`, and make `src/routes/index.tsx` redirect signed-in users into the app and everyone else to `/auth`.
- Root route gets a single `onAuthStateChange` subscriber for router invalidation.

**Data access**
- New `src/lib/profile.functions.ts` server functions using `requireSupabaseAuth`:
  - `getMyProfile` — profile row + features + `onboarding_completed`.
  - `saveMyProfile` — upsert profile fields / `profile_data`.
  - `completeOnboarding` — write features into `match_features` and flip `onboarding_completed`.
- Register the Supabase bearer attacher in `src/start.ts` (currently empty) so those calls are authenticated.
- Discovery keeps calling the existing public `listPublicProfiles` for sample candidates.

**Cleanup**
- Delete `src/lib/deviceIdentity.ts`, the localStorage caching in `src/lib/cloudProfile.ts` and `src/lib/onboardingStorage.ts` flags, plus `GoogleAuthModal`, `GoogleUserMenu`, `GoogleCredentialInspectorModal`, and `src/lib/googleAuth.ts`.
- Header shows the signed-in user's email with a Sign out action in place of the Google menu; the Onboarding button stays as a "retake" entry.
- `src/App.tsx` gets its user from the account instead of `CURRENT_USER`/localStorage; mock candidates remain only as the Discovery fallback pool.

## Notes

- With email confirmation on, sign-up does not sign you in until the emailed link is clicked. If you'd rather have instant sign-in while testing, say so and I'll turn on auto-confirm.
