import { InstructorContext } from "@/contexts/instructorContext";
import { useContext } from "react";

export function useInstructors() {
  const context = useContext(InstructorContext);
  if (context === undefined) {
    throw new Error("useInstructors must be used within an InstructorProvider");
  }
  return context;
}
