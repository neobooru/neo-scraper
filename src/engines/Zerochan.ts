import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { guessContentType } from "../Utility";

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

    if (post.contentUrl == undefined) {
      // No point in continuing when we don't have an image.
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    post.rating = "safe";

    // Set tags
    const tagElements = Array.from(document.getElementById("tags")!.children);

    for (const tagElement of tagElements) {
      // Get tag name from url, because some longer tags are shortened.
      // Eg. "Tate no Yuusha no Nariagari" -> "Tate no Yuusha no Nariaga..."
      // (ironically this is longer, but you get the idea)
      const tagUrl = (tagElement.children[0] as HTMLAnchorElement).pathname.substr(1);
      const tagName = decodeURIComponent(tagUrl.replace(/\+/g, "_")).toLowerCase();

      let tagType = "";
      if (tagElement.childNodes.length > 1 && tagElement.childNodes[1].textContent)
        tagType = tagElement.childNodes[1].textContent.trim().toLowerCase();

      let category: TagCategory | undefined;
      switch (tagType) {
        case "game":
        case "series":
          category = "copyright";
          break;
        case "character":
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
