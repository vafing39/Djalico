import { UserContext } from "@/contexts/userContext";
import { useContext } from "react";

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
