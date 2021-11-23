import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { guessContentType, parseResolutionString } from "../Utility";

export default class Zerochan implements ScrapeEngine {
  name = "zerochan";

  canImport(url: Location): boolean {
    return url.host.endsWith("zerochan.net");
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const previewElements = document.getElementsByClassName("preview");
    if (previewElements.length > 0) {
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
    const resSizeEl = document.querySelector("#large > p > br")?.parentNode as HTMLParagraphElement;
    if (resSizeEl) {
      post.resolution = parseResolutionString(resSizeEl.childNodes[0].textContent);
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
      switch (tagElement.className) {
        case "game":
        case "series":
        case "studio":
          category = "copyright";
          break;
        case "character":
        case "character group":
          category = "character";
          break;
        case "mangaka":
          category = "artist";
          break;
        case "source":
          // Skip these type of tags, because they are not 'booru-like'
          continue;
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
