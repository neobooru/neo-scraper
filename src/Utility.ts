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

export function validateNote(note: ScrapedNote) {
  if (note.text.length == 0) {
    console.log("[validateNote] No text.");
    return false;
  }

  for (const poly of note.polygon) {
    if (poly.some((x) => x > 1 || x < 0)) {
      console.log("[validateNote] Polygon out of range.");
      return false;
    }
  }

  return true;
}

export function xywhToNormalizedPolygon(x: number, y: number, w: number, h: number, resolution: [number, number]) {
  // Normalize our numbers from 0 to 1
  x = x / resolution[0];
  y = y / resolution[1];
  w = w / resolution[0];
  h = h / resolution[1];

  return [
    // Top left
    [x, y],
    // Top right
    [x + w, y],
    // Bottom right
    [x + w, y + h],
    // Bottom left
    [x, y + h],
  ];
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

  const polygon = xywhToNormalizedPolygon(x, y, w, h, post.resolution);
  const note = new ScrapedNote(text, polygon);

  if (validateNote(note)) {
    return note;
  } else {
    return undefined;
  }
}

/**
 * Creates notes by reading ".note-box" and ".note-body" elements.
 * @param document
 * @param boxSize
 * @returns
 */
export function createNotesFromMoebooruBoxes(document: Document, boxSize: [number, number]) {
  let notes: ScrapedNote[] = [];
  const noteBoxes = Array.from(document.querySelectorAll(".note-box")).map((x) => x as HTMLLIElement);
  const noteBodies = Array.from(document.querySelectorAll(".note-body")).map((x) => x as HTMLLIElement);

  if (noteBoxes.length != noteBodies.length) {
    console.log("[createNotesFromMoebooruBoxes] noteBoxes.length != noteBodies.length");
  } else {
    for (let i = 0; i < noteBoxes.length; i++) {
      const noteBox = noteBoxes[i];
      const noteBody = noteBodies[i];

      const text = htmlNoteToMarkdownNote(noteBody.innerHTML);

      const w = parseInt(noteBox.style.width);
      const h = parseInt(noteBox.style.height);
      const y = parseInt(noteBox.style.top);
      const x = parseInt(noteBox.style.left);

      const polygon = xywhToNormalizedPolygon(x, y, w, h, boxSize);
      const note = new ScrapedNote(text, polygon);

      if (validateNote(note)) {
        notes.push(note);
      }
    }
  }
  return notes;
}

export function parseResolutionString(str: string | undefined | null): [number, number] | undefined {
  if (!str) return undefined;

  // Example string: 1600x2200
  const res = str
    .split("x") // Split on 'x' character
    .map((v, _) => v.replace(/\D/g, "")) // Remove all non-digits
    .map((v, _) => parseInt(v)) // Parse ints
    .filter(Number); // Filter NaN. Also removes the number 0, but that's fine because the resolution can't be 0.

  if (res.length == 2) {
    // Kinda hacky, but this is currently the correct way to convert an array to a tuple.
    return [res[0], res[1]];
  } else {
    console.log(`[parseResolutionString] Couldn't parse resolution from '${str}'.`);
  }
}
