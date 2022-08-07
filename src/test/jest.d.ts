import "jest-extended";
import { TagCategory } from "../BooruTypes";

declare global {
  namespace jest {
    interface Matchers<R> {
      // The `= undefined` part is incorrect according to VSCode, but it is actually required.
      toHaveTag(tagName: string, tagCategory: TagCategory | undefined): R;
      toHaveNote(noteText: string): R;
      toHaveResolution(resolution: [number, number]): R;
    }
  }
}
