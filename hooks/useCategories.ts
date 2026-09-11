import { CategoryContext } from "@/contexts/categoryContext";
import { useContext } from "react";

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
