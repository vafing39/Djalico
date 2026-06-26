import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
