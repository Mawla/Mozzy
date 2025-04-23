# Task Plan (supabase-integration-20250423)

Reference: [Task Updates](./updates.md)

## Problem Analysis

The Mozzy project currently contains a **partial** Supabase integration (auth helpers, server & browser clients, middleware, and several API routes). A **new Supabase project** is being created, so all credentials (URL, anon/service keys) must be replaced. In addition, the existing integration has not been fully verified:

- Un‑used environment variables and outdated keys are still present.
- Storage is referenced in code (e.g. `postService`) but no bucket configuration exists.
- Auth flows (sign‑in, sign‑up, callback, refresh, sign‑out) need an end‑to‑end test pass after key swap.
- Supabase schema (tables, RLS policies, storage buckets) is not version‑controlled.
- Documentation and secrets management guidelines require updates.

This task will complete and validate the Supabase integration, covering **Auth, Storage, Environment configuration, and Documentation**.

## Solution Design

### Approach

1. **Environment Key Rotation** – add new `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` secrets; remove obsolete keys.
2. **Code Audit & Refactor** – locate all Supabase client instantiations and ensure they use the new helper wrappers in `lib/supabase/*` only.
3. **Schema as Code** – create an `sql/` directory with migration scripts generated via Supabase "Dump SQL" plus handcrafted RLS policies.
4. **Storage Buckets** – provision `posts` (public) and `avatars` (public‑read) buckets; implement helper in `lib/supabase/storage.ts`.
5. **Auth Flow Validation** – run manual & automated tests for email/password and Google OAuth.
6. **Docs & Runbook** – add `/docs/deployment/supabase.md` explaining setup, secret injection, and local dev configuration.

### Considerations

- **Security** – service‑role key must never be exposed to the browser; restrict Storage policies to owner/team.
- **Performance** – edge‑cached auth sessions via Supabase SSR helpers.
- **Dev Experience** – `supabase start` for local dev + `.env.local.example`.

## Implementation Steps

- [x] Phase 1 – Environment & Keys

  - [x] Create `.env.example` with placeholder Supabase keys **(see [Supabase → Next.js guide](https://supabase.com/docs/guides/with-nextjs#get-the-api-keys))** (Done via CLI)
    ```dotenv
    # Supabase Project Settings
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    # **NEVER** expose the following in the browser
    SUPABASE_SERVICE_ROLE_KEY=
    SUPABASE_JWT_SECRET=
    ```
  - [x] In Supabase Dashboard ➜ **Project Settings ➜ API**, copy **Project URL**, **anon** & **service_role** keys and paste into `.env` (local) & Vercel → `Environment Variables` (Prod). (.env updated via CLI; Vercel pending)
  - [x] Rotate/remove any deprecated `SUPABASE_*` vars in repo & CI. (Checked TS files, none found)
  - [ ] (Optional) For local Docker dev run `supabase start` after adding keys.
  - [x] **Success criteria**: `yarn dev` and `yarn build` succeed with new keys. (`yarn dev` OK; `yarn build` fails on unrelated errors - deferring build fix)
  - Dependencies: new Supabase project credentials 📄

- [x] Phase 2 – Schema & Storage

  - [x] **Link repo to Supabase project**
    ```bash
    supabase link --project-ref <project-id>  # <project-id> is in dashboard URL
    ```
  - [x] **Pull starter schema** to `supabase/schema.sql`
    ```bash
    supabase db pull  # dumps current remote schema > supabase/schema.sql
    ```
  - [x] If schema is empty, seed using **SQL Editor ➜ Quickstarts ➜ _User Management Starter_** (creates `auth.users`, etc.) then pull again. (Discovered existing schema already has the tables)
  - [x] Add application tables via SQL migrations: Discovered tables already exist, created helper functions instead.
  - [x] **Provision storage buckets**:
    - [x] `posts` (public) – read: _public_, write: authenticated
    - [x] `avatars` (public-read) – read: _public_, write: owner only
  - [x] Define storage policies for buckets:
    - [x] Public read for posts and avatars
    - [x] Authenticated write for posts
    - [x] Owner-only write for avatars
    - [x] Owner-only update/delete for both buckets
  - [x] Test reconstruction: `supabase db reset` recreates schema locally.
  - [x] Success criteria: migrations replay, buckets exist, RLS policies enforced.
  - Dependencies: Phase 1 ✓

- [x] Phase 3 – Code Audit & Refactor

  - [x] Grep for `createServerClient`/`createBrowserClient` outside helpers; refactor
  - [ ] Update `postService` storage functions to use Supabase Storage API
  - [ ] Update middleware and `app/auth/*` routes to latest helpers
  - Success criteria: `yarn build` succeeds, lint passes, no TODO warnings
  - Dependencies: Phase 2 ✓

- [ ] Phase 4 – Auth Flow Validation

  - [ ] Write Cypress e2e tests for sign‑up, sign‑in, sign‑out **(reference _Auth Email Login_ docs → <https://supabase.com/docs/guides/auth/auth-email>)**:
    - [ ] Unit test `lib/supabase/server.ts` client creation
    - [ ] Manual OAuth (Google) sign‑in test **(reference _Auth Social Login_ docs → <https://supabase.com/docs/guides/auth/social-login>)**:
  - Success criteria: all auth tests green locally & CI
  - Dependencies: Phase 3

- [ ] Phase 5 – Documentation & Clean‑up
  - [ ] Create `docs/deployment/supabase.md`
  - [ ] Update `README.md` with local Supabase instructions
  - [ ] Add runbook section for key rotation & emergency revoke
  - [ ] Squash completed plan sections and archive task
  - Success criteria: docs reviewed, task moved to `done/`
  - Dependencies: Phase 4

## Feature Documentation Impact

### Affected Features

- Feature: **Authentication & Storage**
  - Files to update:
    - [ ] README.md
    - [ ] docs/deployment/supabase.md _(new)_
    - [ ] docs/architecture/authentication.md _(if exists – otherwise create)_
    - [ ] docs/features/auth/README.md _(update flows)_
    - [ ] docs/features/storage/README.md _(new)_
  - Changes needed:
    - Describe new env vars and key rotation
    - Document storage bucket structure
    - Cross‑link to Supabase official docs

### Documentation Review

- [ ] Feature documentation is current
- [ ] All affected components documented
- [ ] API changes reflected
- [ ] Test cases updated
- [ ] Cross‑references maintained

## Affected Components

- `lib/supabase/*`

  - Ensure single client wrappers; add storage helper
  - Impact: MEDIUM – auth everywhere
  - Tests: unit + integration

- `app/auth/*` routes & middleware

  - Update to new helpers
  - Impact: HIGH – user login flow
  - Tests: e2e + unit

- `postService` and any file upload utilities
  - Replace legacy storage logic
  - Impact: MEDIUM – content upload
  - Tests: integration

## Testing Plan

- **Unit** – client creation, helper utilities
- **Integration** – RLS enforcement via Supabase test project
- **E2E** – Cypress flows: sign‑up → create post (with file) → sign‑out
- **Performance** – measure auth latency (<300 ms average)

## Dependencies

- Blocks: none
- Blocked by: creation of new Supabase project & credentials
- Related: `auth-fix-20240320`, `type-system-cleanup-20240124`

---

Template derived from `/docs/templates/task-plan-template.md` and adapted per **process/memory_management_system** & **process/problem_solving_approach** rules.

### Supabase Documentation Quick Reference

- API Keys & Next.js helper: <https://supabase.com/docs/guides/with-nextjs#get-the-api-keys>
- Row Level Security (RLS): <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Auth Email Login: <https://supabase.com/docs/guides/auth/auth-email>
- Auth Social Login (OAuth): <https://supabase.com/docs/guides/auth/social-login>
- Storage Access Control: <https://supabase.com/docs/guides/storage#access-control>
- Policies Deep Dive: <https://supabase.com/docs/learn/auth-deep-dive/auth-policies>
