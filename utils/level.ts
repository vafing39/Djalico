import type { TagType } from "@/types";

const LEVEL_RANK: Record<TagType, number> = { beginner: 0, intermediate: 1, expert: 2 };

export function isLevelAccessible(contentLevel: TagType, userLevel?: TagType | null): boolean {
  if (!userLevel) return true;
  return LEVEL_RANK[contentLevel] <= LEVEL_RANK[userLevel];
}

export function accessibleLevels(userLevel?: TagType | null): TagType[] {
  const all: TagType[] = ["beginner", "intermediate", "expert"];
  if (!userLevel) return all;
  return all.filter((l) => LEVEL_RANK[l] <= LEVEL_RANK[userLevel]);
}
