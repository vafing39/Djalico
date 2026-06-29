import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import type { AuditEntry } from "@/types";

export type { AuditEntry };

export function useAuditLog() {
  return useQuery({
    queryKey: ["audit_log"],
    queryFn: async () => {
      const [logsResult, usersResult] = await Promise.all([
        supabase
          .from("audit_log")
          .select("id, action, entity_type, entity_title, created_at, actor_id")
          .order("created_at", { ascending: false }),
        supabase.from("users").select("id, name"),
      ]);

      if (logsResult.error) throw logsResult.error;
      if (usersResult.error) throw usersResult.error;

      const userMap = new Map(
        (usersResult.data ?? []).map((u) => [u.id, u.name])
      );

      return (logsResult.data ?? []).map((row) => ({
        id: row.id,
        action: row.action,
        entity_type: row.entity_type,
        entity_title: row.entity_title,
        created_at: row.created_at,
        actor_name: row.actor_id ? (userMap.get(row.actor_id) ?? null) : null,
      })) as AuditEntry[];
    },
  });
}
