import "jest-extended";
import { TagCategory } from "../BooruTypes.js";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTag(tagName: string, tagCategory?: TagCategory): CustomMatcherResult;
      toHaveNote(noteText: string): CustomMatcherResult;
      toHaveResolution(resolution: [number, number]): CustomMatcherResult;
      toHaveSource(source: string): CustomMatcherResult;
    }
  }
}

export {};
