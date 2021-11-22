import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapedNote } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { createNotesFromMoebooruBoxes, guessContentType } from "../Utility";

export default class SankakuComplex extends ScrapeEngineBase {
  name = "sankakucomplex";

  canImport(url: Location): boolean {
    return url.host == "chan.sankakucomplex.com";
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const originalImageElement = document.getElementById("highres") as HTMLAnchorElement;

    if (originalImageElement) {
      post.contentUrl = originalImageElement.href;
    } else {
      // No point in continuing when we don't have an image.
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    const safetyExp = new RegExp("Rating: (.*)");
    const safetyElements = Array.from(document.querySelectorAll("#stats > ul > li"))
      .map((x) => x as HTMLLIElement)
      .filter((x) => x.innerText.startsWith("Rating"));

    if (safetyElements.length > 0) {
      const matches = safetyElements[0].innerText.match(safetyExp);
      if (matches && matches.length > 0) {
        switch (matches[1].toLowerCase()) {
          case "safe":
            post.rating = "safe";
            break;
          case "questionable":
            post.rating = "sketchy";
            break;
          case "explicit":
            post.rating = "unsafe";
            break;
        }
      }
    }

    // Set tags
    const tagElements = Array.from(document.querySelectorAll("#tag-sidebar > li")).map((x) => x as HTMLLIElement);
    for (const tagElement of tagElements) {
      let tagName: string | undefined;
      const tagNameElement = tagElement.querySelector("a") as HTMLAnchorElement;
      if (tagNameElement) {
        tagName = tagNameElement.innerText;
      }

      let category: TagCategory | undefined;
      switch (tagElement.className) {
        case "tag-type-copyright":
          category = "copyright";
          break;
        case "tag-type-character":
          category = "character";
          break;
        case "tag-type-artist":
          category = "artist";
          break;
        case "tag-type-medium":
          category = "meta";
          break;
      }

      if (tagName) {
        let tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    // Set notes
    const postContentEl = document.querySelector("#image-link > img") as HTMLImageElement;
    if (!postContentEl) {
      this.log("postContentEl is undefined.");
    } else {
      const boxSize: [number, number] = [postContentEl.width, postContentEl.height];
      post.notes = createNotesFromMoebooruBoxes(document, boxSize);
    }

    result.tryAddPost(post);

    return result;
  }
}
