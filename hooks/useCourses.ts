import { CourseContext } from "@/contexts/courseContext";
import { useContext } from "react";

export function useCourses() {
  return useContext(CourseContext);
}
