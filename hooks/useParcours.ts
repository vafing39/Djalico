import { ParcoursContext } from "@/contexts/parcoursContext";
import { useContext } from "react";

export function useParcours() {
  const context = useContext(ParcoursContext);
  if (context === undefined) {
    throw new Error("useParcours must be used within a ParcoursProvider");
  }
  return context;
}
