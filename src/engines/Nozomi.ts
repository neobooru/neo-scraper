import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";

export default class e621 extends ScrapeEngineBase {
  name = "nozomi";
  features: ScrapeEngineFeature[] = ["content", "tags", "tag_category"];
  notes = ["Image preview might not work due to hotlink protection."];
  supportedHosts = ["nozomi.la"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector(".post a") as HTMLAnchorElement;
    post.contentUrl = downloadEl?.href;

    // Set tags
    const tagEls = Array.from(document.querySelectorAll(".sidebar li")).map((x) => x as HTMLLIElement);

    for (const el of tagEls) {
      const tagName = el.innerText;
      let category: TagCategory | undefined;

      switch (el.querySelector("a")?.className) {
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
      }

      if (tagName) {
        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    result.tryAddPost(post);

    return result;
  }
}
