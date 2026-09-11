import { SavedContext } from "@/contexts/savedContext";
import { useContext } from "react";

export function useSaved() {
  const context = useContext(SavedContext);
  if (context === undefined) {
    throw new Error("useSaved must be used within a SavedProvider");
  }
  return context;
}
