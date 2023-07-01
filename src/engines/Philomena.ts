import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { SafetyRating, TagCategory } from "../BooruTypes.js";

export default class Philomena extends ScrapeEngineBase {
  name = "Philomena";
  features: ScrapeEngineFeature[] = ["content", "rating", "tags", "source"];
  notes = [];
  supportedHosts = [
    "derpibooru.org",
    "trixiebooru.org",
    "ponybooru.org",
    "furbooru.org",
    "ponerpics.org",
    "manebooru.art",
    "twibooru.org",
  ];
  safetyMap = new Map<string, SafetyRating>([
    ["safe", "safe"],
    ["suggestive", "sketchy"],
    ["questionable", "sketchy"],
    ["explicit", "unsafe"],
  ]);
  categoryMap = new Map<string, TagCategory>([
    ["character", "character"],
    ["species", "species"],
    ["oc", "character"],
  ]);

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector("a[title='Download (no tags in filename)']") as HTMLAnchorElement;
    post.contentUrl = downloadEl?.href;

    // Set content type
    if (document.querySelector("video#image-display") != null) {
      post.contentType = "video";
    }

    // Set default rating (Will be determined later)
    post.rating = "unsafe";

    // Set tags
    const tagEls = Array.from(document.querySelectorAll(".tag.dropdown")).map((x) => x as HTMLSpanElement);

    for (const el of tagEls) {
      let tagName = el.getAttribute("data-tag-name");
      if (!tagName) continue;

      // Set rating (philomena uses tags for this)
      // These tags also have `data-tag-category="rating"` which we could use.
      const safety = this.safetyMap.get(tagName);
      if (safety != undefined) {
        post.rating = safety;
        // Don't add this as a tag.
        continue;
      }

      let category: TagCategory | undefined;
      const artistMatches = tagName.match("artist:(.*)");
      if (artistMatches && artistMatches.length == 2) {
        tagName = artistMatches[1];
        category = "artist";
      }

      const dataTagCategory = el.getAttribute("data-tag-category");
      if (dataTagCategory) {
        const mappedCategory = this.categoryMap.get(dataTagCategory);
        if (mappedCategory) {
          category = mappedCategory;
        }
      }

      if (tagName) {
        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    // Set source
    const sourceEls = Array.from(document.querySelectorAll("a.js-source-link")).map((x) => x as HTMLAnchorElement);
    post.sources = sourceEls.map((x) => x.href);

    result.tryAddPost(post);

    return result;
  }
}
