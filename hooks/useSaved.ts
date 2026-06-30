import { SavedContext } from "@/contexts/savedContext";
import { useContext } from "react";

export function useSaved() {
  return useContext(SavedContext);
}
