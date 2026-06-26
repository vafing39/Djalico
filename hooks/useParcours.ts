import { ParcoursContext } from "@/contexts/parcoursContext";
import { useContext } from "react";

export function useParcours() {
  return useContext(ParcoursContext);
}
