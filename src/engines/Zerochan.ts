import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";
import { guessContentType, parseResolutionString } from "../Utility.js";

export default class Zerochan extends ScrapeEngineBase {
  name = "zerochan";
  features: ScrapeEngineFeature[] = ["content", "resolution", "tags", "tag_category"];
  notes = ["Rating is assumed to be safe."];
  supportedHosts = ["zerochan.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const previewElements = document.getElementsByClassName("preview");
    if (previewElements.length > 0 && (previewElements[0] as HTMLAnchorElement).href) {
      // The preview element only exists when there is a larger size available. Preview's img element contains a downscaled version.
      post.contentUrl = (previewElements[0] as HTMLAnchorElement).href;
    } else {
      // When there is no larger version available just use the displayed version.
      const imgElement = document.querySelector("img[title='No larger size available']") as HTMLImageElement;
      if (imgElement) {
        post.contentUrl = imgElement.src;
      }
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set resolution
    const resSizeEl = document.querySelector("#image-info")?.firstElementChild;
    if (resSizeEl) {
      post.resolution = parseResolutionString(resSizeEl.textContent?.replace("×", "x"));
    }

    // Set rating
    post.rating = "safe";

    // Set tags
    const tagElements = Array.from(document.querySelectorAll("#tags > li"));

    for (const tagElement of tagElements) {
      // Get tag name from url, because some longer tags are shortened.
      // Eg. "Tate no Yuusha no Nariagari" -> "Tate no Yuusha no Nariaga..."
      // (ironically this is longer, but you get the idea)
      let tagName: string | undefined = undefined;
      const tagUrl = (tagElement.querySelector("a") as HTMLAnchorElement | undefined)?.pathname?.substr(1);
      if (tagUrl) {
        tagName = decodeURIComponent(tagUrl.replace(/\+/g, "_")).toLowerCase();
      }

      let category: TagCategory | undefined;
      const className = tagElement.classList[0];
      switch (className) {
        case "game":
        case "series":
        case "studio":
          category = "copyright";
          break;
        case "character":
          category = "character";
          break;
        case "mangaka":
          category = "artist";
          break;
        case "source":
          // Skip these type of tags, because they are not 'booru-like'.
          continue;
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
