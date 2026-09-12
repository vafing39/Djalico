---
name: first-security-audit
description: Results of the first full security audit (2026-09-12) — live unauthenticated admin-creating edge functions, committed .env credentials, and open storage policies; tracks what still needs rotation/removal
metadata:
  type: project
---

The first full security audit of Djalico ran on 2026-09-12 against Supabase project `yefxqvbrcvxuyqtjipxy`. Four issues were reported as needing action; none were fixed by the audit (this agent does not write).

Outstanding at time of audit:

1. Edge functions `reset-password` and `fix-users` were deployed with `verify_jwt: false` and no internal auth check, both using the service-role key to `auth.admin.createUser`. `reset-password` mints an `admin` (lucas@djalico.com) and `fix-users` mints a `professeur` (kofi@djalico.com) plus 9 students, all with the hardcoded password `password123`. These were seeding scripts shipped as public endpoints. Both seeded accounts exist in production and kofi (professeur) has signed in.
2. `.env` is committed to git (`.gitignore` only covers `.env*.local`) and carries a working admin password in an `EXPO_PUBLIC_*` var, so it is also bundled into the shipped app. Credentials need rotating, not just untracking — git history has them.
3. Storage policies are bucket-wide, not per-owner: any authenticated user can write/delete any object in the `videos` bucket under `private/`, and any object in the public `image` bucket (including `avatars/<any-user-id>`).
4. Table-level RLS was found to be genuinely correct — every table has RLS on with server-side role checks via `current_user_role()`, and a `prevent_privileged_self_update` BEFORE UPDATE trigger on `users` blocks self-escalation of role/level/status. The client-side `isAdmin` guard in `app/(protected)/_layout.tsx` is a real UX-only layer over real enforcement. Do not re-report the client guard as a finding.

**Why:** This was a pre-existing dev/seed setup that was never cleaned up before the app went to real users (two real admins and real students are in `auth.users`). The exposure is live, not theoretical.

**How to apply:** On any follow-up audit, re-check items 1-3 first — confirm the two edge functions are deleted or JWT-gated, confirm the anon key and lucas/kofi passwords were rotated after `.env` was purged from history, and confirm storage policies were scoped by owner. If they are still open, they remain the top findings and everything else is noise by comparison. See [[djalico-supabase-backend]].
