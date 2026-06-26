import { LessonContext } from "@/contexts/lessonContext";
import { useContext } from "react";

export function useLessons() {
  return useContext(LessonContext);
}
