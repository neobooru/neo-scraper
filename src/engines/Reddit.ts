import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { guessContentType } from "../Utility.js";

export default class Reddit extends ScrapeEngineBase {
  name = "reddit";
  features: ScrapeEngineFeature[] = ["content"];
  notes = [];
  supportedHosts = ["reddit.com", "new.reddit.com", "old.reddit.com"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // For old.reddit.com
    const oldLinkElements = document.querySelectorAll("a.title");
    if (oldLinkElements.length > 0) {
      post.contentUrl = (oldLinkElements[0] as HTMLAnchorElement).href;
    }

    // For new reddit
    const newLinkEl = document.querySelector("div[data-test-id='post-content'] img.ImageBox-image")?.parentElement;
    if (newLinkEl) {
      post.contentUrl = (newLinkEl as HTMLAnchorElement).href;
    }

    if (post.contentUrl != undefined) {
      post.contentType = guessContentType(post.contentUrl);
    }

    result.tryAddPost(post);

    return result;
  }
}
