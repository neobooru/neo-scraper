import { ScrapeEngine, ScrapeResult, ScrapedPost } from "../ScrapeEngine";
import { guessContentType } from "../Utility";

export default class Reddit implements ScrapeEngine {
  name = "reddit";

  canImport(url: Location): boolean {
    return url.host.endsWith("reddit.com");
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // For old.reddit.com
    const oldLinkElements = document.querySelectorAll("a.title");
    if (oldLinkElements.length > 0) {
      post.contentUrl = (oldLinkElements[0] as HTMLAnchorElement).href;
    }

    // For new reddit
    const newLinkElements = document.querySelectorAll("div[data-test-id='post-content'] > div > a");
    if (newLinkElements.length > 0) {
      post.contentUrl = (newLinkElements[0] as HTMLAnchorElement).href;
    }

    if (post.contentUrl != undefined) {
      post.contentType = guessContentType(post.contentUrl);
    }

    result.tryAddPost(post);

    return result;
  }
}
