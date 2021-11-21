import { JSDOM } from "jsdom";
import { ScrapedPost } from "../ScrapeEngine";

// Expose JSDOM Element constructor
// @ts-ignore
global.Element = new JSDOM().window.Element;
// 'Implement' innerText in JSDOM: https://github.com/jsdom/jsdom/issues/1245
// @ts-ignore
Object.defineProperty(global.Element.prototype, "innerText", {
  get() {
    return this.textContent.replace(/(\r\n|\n|\r|^\s+|\s+$)/gm, "");
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTag(tagName: string): CustomMatcherResult;
    }
  }
}

// Add our own functions
expect.extend({
  toHaveTag(received: any, tagName: string): jest.CustomMatcherResult {
    let pass: boolean = false;
    const message = () => (pass ? "" : `post does not have the '${tagName}' tag.`);

    if (received instanceof ScrapedPost) {
      pass = received.tags.find((x) => x.name == tagName) != undefined;
    }
    return { pass, message };
  },
});
