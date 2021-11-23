import { JSDOM } from "jsdom";
import { TagCategory } from "../BooruTypes";
import { ScrapedPost } from "../ScrapeEngine";

// Expose JSDOM Element constructor
global.Element = new JSDOM().window.Element;
// 'Implement' innerText in JSDOM: https://github.com/jsdom/jsdom/issues/1245
// This implementation is not 100% correct, but usually good enough so that the tests pass.
Object.defineProperty(global.Element.prototype, "innerText", {
  get() {
    return this.textContent.replace(/(\r\n|\n|\r|^\s+|\s+$)/gm, "");
  },
});

// Add our own functions
expect.extend({
  toHaveTag(
    received: any,
    tagName: string,
    tagCategory: TagCategory | undefined = undefined
  ): jest.CustomMatcherResult {
    let pass: boolean = false;
    const message = () => (pass ? "" : `Post does not have the '${tagName}' tag, or the category is incorrect.`);

    if (received instanceof ScrapedPost) {
      const found = received.tags.find((x) => x.name == tagName);
      if (found) {
        if (tagCategory) {
          pass = found.category == tagCategory;
        } else {
          pass = true;
        }
      }
    }
    return { pass, message };
  },
  toHaveNote(received: any, noteText: string): jest.CustomMatcherResult {
    let pass: boolean = false;
    const message = () => (pass ? "" : `Post does not have a note with '${noteText}'.`);

    if (received instanceof ScrapedPost) {
      pass = received.notes.find((x) => x.text == noteText) != undefined;
    }
    return { pass, message };
  },
  toHaveResolution(received: any, resolution: [number, number]): jest.CustomMatcherResult {
    let pass: boolean = false;
    const message = () => (pass ? "" : `Expected: ${resolution}\nReceived: ${received?.resolution}`);

    if (received instanceof ScrapedPost && received.resolution?.length == 2) {
      pass = received.resolution[0] == resolution[0] && received.resolution[1] == resolution[1];
    }
    return { pass, message };
  },
});
