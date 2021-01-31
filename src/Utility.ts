import { ContentType } from "./ScrapeEngine";

// https://github.com/sindresorhus/video-extensions/blob/main/video-extensions.json
export const videoExtensions = [
  "3g2",
  "3gp",
  "aaf",
  "asf",
  "avchd",
  "avi",
  "drc",
  "flv",
  "m2v",
  "m4p",
  "m4v",
  "mkv",
  "mng",
  "mov",
  "mp2",
  "mp4",
  "mpe",
  "mpeg",
  "mpg",
  "mpv",
  "mxf",
  "nsv",
  "ogg",
  "ogv",
  "qt",
  "rm",
  "rmvb",
  "roq",
  "svi",
  "vob",
  "webm",
  "wmv",
  "yuv",
];

export function getUrlExtension(url: string) {
  return url.split(/[#?]/)[0].split(".").pop()!.trim();
}

export function guessContentType(url: string): ContentType {
  if (url != undefined) {
    const ext = getUrlExtension(url);
    if (videoExtensions.indexOf(ext) != -1) return "video";
  }
  return "image";
}
