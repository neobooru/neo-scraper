import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { guessContentType } from "../Utility";

export default class AnimePictures implements ScrapeEngine {
  name = "animepictures";

  canImport(url: Location): boolean {
    return url.host == "anime-pictures.net";
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;
    post.source = document.location.href;

    // Set image url
    const originalImageElements = Array.from(document.getElementsByClassName("download_icon"));

    if (originalImageElements.length > 0) {
      post.contentUrl = (originalImageElements[0] as HTMLAnchorElement).href;
    } else {
      // No point in continuing when we don't have an image.
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    post.rating = "safe"; // Probably

    // Set tags
    const tagElements = Array.from(document.querySelectorAll("ul.tags > li > a")).map((x) => x as HTMLAnchorElement);
    for (const tagElement of tagElements) {
      let tagName = tagElement.innerText;

      let category: TagCategory | undefined;
      for (const className of tagElement.classList) {
        switch (className) {
          case "copyright":
            category = "copyright";
            break;
          case "character":
            category = "character";
            break;
          case "artist":
            category = "artist";
            break;
        }
      }

      if (tagName) {
        let tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    result.tryAddPost(post);

    return result;
  }
}
