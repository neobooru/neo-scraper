import TurndownService from "turndown";
import { ContentType, ScrapedNote, ScrapedPost } from "./ScrapeEngine";

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

export function htmlNoteToMarkdownNote(text: string) {
  return new TurndownService().turndown(text);
}

export function createNoteFromDanbooruArticle(post: ScrapedPost, el: HTMLElement): ScrapedNote | undefined {
  function logFail(str: string) {
    console.log("[createNoteFromDanbooruArticle] Can't create note. " + str);
  }

  function getInt(map: DOMStringMap, key: string) {
    const value = map[key];
    if (!value) {
      logFail(`Key '${key}' not found in data.`);
      return undefined;
    }
    const num = parseInt(value);
    if (num == NaN) {
      logFail(`parseInt on '${value}' returned NaN.`);
    }
    return num;
  }

  function validateNote(note: ScrapedNote) {
    for (const poly of note.polygons) {
      if (poly.some((x) => x > 1 || x < 0)) {
        logFail("Polygon out of range.");
        return false;
      }
    }

    return true;
  }

  if (!post.resolution) {
    logFail("Post resolution is undefined.");
    return undefined;
  }

  const data = (<any>el).dataset as DOMStringMap;

  if (!data) {
    logFail("Data is undefined.");
    return undefined;
  }

  let text = data["body"];
  if (text) {
    text = htmlNoteToMarkdownNote(text);
  }

  let x = getInt(data, "x");
  let y = getInt(data, "y");
  let w = getInt(data, "width");
  let h = getInt(data, "height");

  if (!text || !x || !y || !w || !h) {
    logFail("A required data field could not be parsed.");
    return undefined;
  }

  // Normalize our numbers from 0 to 1
  x = x / post.resolution[0];
  y = y / post.resolution[1];
  w = w / post.resolution[0];
  h = h / post.resolution[1];

  const polygons = [
    // Top left
    [x, y],
    // Top right
    [x + w, y],
    // Bottom right
    [x + w, y + h],
    // Bottom left
    [x, y + h],
  ];

  const note = new ScrapedNote(text, polygons);
  if (validateNote(note)) {
    return note;
  } else {
    return undefined;
  }
}
