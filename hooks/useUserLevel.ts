import { useAuth } from "./useAuth";

export function useUserLevel() {
  return useAuth().profile?.level;
}
