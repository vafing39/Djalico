import { UserContext } from "@/contexts/userContext";
import { useContext } from "react";

export function useUsers() {
  return useContext(UserContext);
}
