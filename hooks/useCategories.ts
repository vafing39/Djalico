import { CategoryContext } from "@/contexts/categoryContext";
import { useContext } from "react";

export function useCategories() {
  return useContext(CategoryContext);
}
