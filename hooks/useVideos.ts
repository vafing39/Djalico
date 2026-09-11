import { VideoContext } from "@/contexts/videoContext";
import { useContext } from "react";

export function useVideos() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
}
