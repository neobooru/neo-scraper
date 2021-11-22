import "jest-extended";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTag(tagName: string): CustomMatcherResult;
      toHaveNote(noteText: string): CustomMatcherResult;
    }
  }
}
