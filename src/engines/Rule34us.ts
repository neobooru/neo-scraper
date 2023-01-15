// Technically speaking rule34.us also uses gelbooru, albeit a (heavily?) modified one.
// Because pretty much no scraper code can be shared with other gelbooru-likes it makes more sense to create a new engine for rule34.us.

import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";
import { CategoryMap } from "./Common.js";
import { guessContentType, parseResolutionString } from "../Utility.js";

export default class Gelbooru extends ScrapeEngineBase {
  name = "rule34us";
  features: ScrapeEngineFeature[] = ["content", "resolution", "tags", "tag_category"];
  notes = ["Rating is assumed to be unsafe."];
  supportedHosts = ["rule34.us"];

  private readonly classNameToCategoryMap: CategoryMap = {
    "character-tag": "character",
    "artist-tag": "artist",
    "copyright-tag": "copyright",
    "metadata-tag": "meta",
  };

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const origImgEls = Array.from(document.querySelectorAll("ul > a"))
      .map((x) => x as HTMLAnchorElement)
      .filter((x) => x.innerText == "Original");

    if (origImgEls.length > 0) {
      post.contentUrl = origImgEls[0].href;
    } else {
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set resolution
    const statEls = Array.from(document.querySelectorAll<HTMLLIElement>(".container > ul > div > li"));
    const sizeEl = statEls.find((x) => x.innerText.indexOf("Size:") != -1);
    if (sizeEl) {
      post.resolution = parseResolutionString(sizeEl.innerText);
    }

    // Patch contentUrl if contentType == "video"
    // This is because the "Original" button does link to "302 Found" for videos. Idk why.
    // Shit's fucked, there are multiple workarounds for that and this is one of them.
    if (post.contentType == "video") {
      post.contentUrl = post.contentUrl.replace("img2.rule34", "video.rule34");
    }

    // This is where we would set the rating and source,
    // but rule34.us doesn't display those as far as I can see.
    post.rating = "unsafe"; // Lucky guess.

    // Set tags
    const possibleTagEls = Array.from(document.querySelectorAll(".container > ul > li")).map((x) => x as HTMLLIElement);

    for (const el of possibleTagEls) {
      // Idk why booru sites can't have consistent a HTML DOM.
      // Not all elements inside `possibleTagEls` are actually tags,
      // only elements that have a `a` tag as a direct child are valid tags.
      // E.g. the 'Edit' button also has the `general-tag` class, but it certainly is not a tag.

      const anchor = el.firstElementChild as HTMLAnchorElement | null;
      if (anchor?.tagName == "A") {
        const name = anchor.innerText;
        const category = this.classNameToCategoryMap[el.className] as TagCategory | undefined;
        post.tags.push(new ScrapedTag(name, category));
      }
    }

    result.tryAddPost(post);
    return result;
  }
}
