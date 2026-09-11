import { LessonContext } from "@/contexts/lessonContext";
import { useContext } from "react";

export function useLessons() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessons must be used within a LessonProvider");
  }
  return context;
}
