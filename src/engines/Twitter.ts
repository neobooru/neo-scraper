import { ScrapeEngine, ScrapeResult, ScrapedPost } from "../ScrapeEngine";
import { guessContentType } from "../Utility";

export function getOriginalImageUrl(imageUrl: string) {
  const x = imageUrl.replace(/:large|:med|:small|:orig$/, ""); // Remove `:large`, `:small` etc from url
  return x + ":orig"; // Add :orig to url (to get original image)
}

export default class Twitter implements ScrapeEngine {
  name = "twitter";

  canImport(url: Location): boolean {
    return url.host == "twitter.com";
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // When clicked on post (not fullscreen, with post text etc)
    const overlayElement = document.querySelector("#permalink-overlay-dialog");
    if (overlayElement) {
      const cardImageElement = overlayElement.querySelector("div[data-element-context='platform_photo_card'] > img");
      if (cardImageElement) {
        post.contentUrl = getOriginalImageUrl((cardImageElement as HTMLImageElement).src);
      }
    }

    // When clicked on image (fullscreen)
    const mediaImageElements = document.querySelectorAll("div.Gallery-media > img.media-image");
    if (mediaImageElements.length > 0) {
      post.contentUrl = getOriginalImageUrl((mediaImageElements[0] as HTMLImageElement).src);
    }

    if (post.contentUrl == undefined) {
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    result.tryAddPost(post);

    return result;
  }
}
