import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";

export default class e621 extends ScrapeEngineBase {
  name = "e621";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags", "tag_category", "source"];
  notes = [];
  supportedHosts = ["e621.net", "e926.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector("#image-download-link > a") as HTMLAnchorElement;
    post.contentUrl = downloadEl?.href;

    // Set content type
    if (document.querySelector("video#image") != null) {
      post.contentType = "video";
    }

    // Set rating
    const ratingEl = document.getElementById("post-rating-text") as HTMLSpanElement;
    switch (ratingEl?.innerText) {
      case "Safe":
        post.rating = "safe";
        break;
      case "Questionable":
        post.rating = "sketchy";
        break;
      case "Explicit":
        post.rating = "unsafe";
        break;
    }

    // Set resolution
    const width = parseInt((<HTMLSpanElement>document.querySelector("span[itemprop='width']"))?.innerText);
    const height = parseInt((<HTMLSpanElement>document.querySelector("span[itemprop='height']"))?.innerText);
    if (!isNaN(width) && !isNaN(height)) {
      post.resolution = [width, height];
    }

    // Set tags
    const tagEls = Array.from(document.querySelectorAll("#tag-list > ul > li")).map((x) => x as HTMLLIElement);

    for (const el of tagEls) {
      const tagName = decodeURIComponent(el.getAttribute("data-name") as string);
      let category: TagCategory | undefined;

      switch (el.getAttribute("data-category")) {
        // https://e621.net/help/api#tags_listing
        case "copyright":
          category = "copyright";
          break;
        case "character":
          category = "character";
          break;
        case "artist":
          category = "artist";
          break;
        case "meta":
          category = "meta";
          break;
        case "species":
          category = "species";
          break;
        // case "invalid":
        //   category = "invalid";
        //   break;
        case "lore":
          category = "lore";
          break;
      }

      if (tagName) {
        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    // Set source
    const sourceEls = Array.from(document.querySelectorAll(".source-link > a")).map((x) => x as HTMLAnchorElement);
    post.sources = sourceEls.map((x) => x.href);

    result.tryAddPost(post);

    return result;
  }
}
