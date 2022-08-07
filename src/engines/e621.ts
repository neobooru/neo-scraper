import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

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
      const tagName = (el.querySelector(".search-tag") as HTMLAnchorElement)?.innerText;
      let category: TagCategory | undefined;

      switch (el.className) {
        // https://e621.net/help/api#tags_listing
        case "category-3":
          category = "copyright";
          break;
        case "category-4":
          category = "character";
          break;
        case "category-1":
          category = "artist";
          break;
        case "category-7":
          category = "meta";
          break;
        case "category-5":
          category = "species";
          break;
        // case "category-6":
        //   category = "invalid";
        //   break;
        case "category-8":
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
    // We currently only support one source.
    if (sourceEls.length > 0) {
      post.source = sourceEls[0].href;
    }

    result.tryAddPost(post);

    return result;
  }
}
