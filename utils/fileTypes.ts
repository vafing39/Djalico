const IMAGE_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  gif: "image/gif",
};

export function guessImageFile(uri: string): { ext: string; contentType: string } {
  const raw = (uri.split(".").pop() ?? "").split("?")[0].toLowerCase();
  const contentType = IMAGE_CONTENT_TYPES[raw];
  return contentType ? { ext: raw, contentType } : { ext: "jpg", contentType: "image/jpeg" };
}

const VIDEO_CONTENT_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  webm: "video/webm",
  m3u8: "application/vnd.apple.mpegurl",
};

export function guessVideoFile(uri: string): { ext: string; contentType: string } {
  const raw = (uri.split(".").pop() ?? "").split("?")[0].toLowerCase();
  const contentType = VIDEO_CONTENT_TYPES[raw];
  return contentType ? { ext: raw, contentType } : { ext: "mp4", contentType: "video/mp4" };
}
