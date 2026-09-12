---
name: djalico-supabase-backend
description: Where Djalico's server-side authorization actually lives in Supabase — which tables/functions/buckets to check and the read-only MCP queries that surface them
metadata:
  type: reference
---

Djalico's backend is Supabase project ref `yefxqvbrcvxuyqtjipxy` (URL in `.env` / `.mcp.json`). Server-side authorization lives in four places, and a full audit has to look at all four — the first three are easy to miss because `list_tables` alone reports everything as fine:

- **Table RLS** — `pg_policies` for schema `public`. Role checks go through the SECURITY DEFINER helper `public.current_user_role()`.
- **Triggers on `public.users`** — `prevent_privileged_self_update()` is what actually blocks role/level/status escalation; the `users: update own` policy alone does not, since its USING clause only pins `id = auth.uid()`. Audit triggers (`log_audit_event`, `log_video_update`, `log_video_publish`) write to `audit_log`, which has a SELECT-only admin policy and no INSERT policy (the SECURITY DEFINER triggers bypass it).
- **Storage** — `storage.buckets` and `pg_policies` for schema `storage`. Buckets are `videos` (private), `avatar` (private, zero policies, apparently unused), `image` (public). These are a separate policy surface from table RLS.
- **Edge functions** — `list_edge_functions` reports a `verify_jwt` flag per function; a `false` there means the endpoint is reachable by anyone on the internet with no token at all, regardless of what the function body assumes.

**How to apply:** Reach these with the read-only MCP tools — `execute_sql` against `pg_policies`, `pg_trigger`, `pg_proc`, `storage.buckets`, and `auth.users`; `list_edge_functions` + `get_edge_function` for function source. Never call `apply_migration` or a mutating `execute_sql`. See [[first-security-audit]] for what these surfaces looked like on 2026-09-12.
