import { VideoContext } from "@/contexts/videoContext";
import { useContext } from "react";

export function useVideos() {
  return useContext(VideoContext);
}
