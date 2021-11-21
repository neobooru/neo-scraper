import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { guessContentType } from "../Utility";

export default class e621 implements ScrapeEngine {
  name = "furaffinity";

  canImport(url: Location): boolean {
    return url.host == "www.furaffinity.net";
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);

    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // Could use the download button here, but as far as I can tell it doesn't matter.
    const downloadEl = document.querySelector("#submissionImg") as HTMLImageElement;
    post.contentUrl = downloadEl?.src;

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    const ratingEls = Array.from(document.querySelectorAll("div.rating > span.rating-box")).map(
      (x) => x as HTMLSpanElement
    );

    if (ratingEls.length > 0)
      switch (ratingEls[0].innerText) {
        case "General":
          post.rating = "safe";
          break;
        case "Mature":
          post.rating = "sketchy";
          break;
        case "Adult":
          post.rating = "unsafe";
          break;
      }

    // Set tags
    post.tags = Array.from(document.querySelectorAll("section.tags-row > span.tags"))
      .map((x) => (x as HTMLSpanElement).innerText)
      .map((x) => new ScrapedTag(x));

    // Set source
    post.source = document.location.href;

    result.tryAddPost(post);

    return result;
  }
}
