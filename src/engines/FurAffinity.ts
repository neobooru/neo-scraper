import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { guessContentType } from "../Utility";

export default class e621 implements ScrapeEngine {
  name = "FurAffinity";

  canImport(url: Location): boolean {
    return url.host == 'www.furaffinity.net';
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);

    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector("#submissionImg") as HTMLImageElement;
    post.contentUrl = downloadEl?.src;

    if (post.contentUrl == undefined) {
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    // TODO: not so sure about this? maybe there is a more elegant solution
    const ratingEl = document.querySelectorAll("div.rating > span.font-large.rating-box.inline")[0] as HTMLSpanElement;
    switch (ratingEl?.innerText) {
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
    // Shimmie2 doesn't support categories so we don't need to worry about those.
    // They also use uppercase tags, so we toLowerCase() those.
    // Tags might not match with other booru-likes, but that is for the user to figure out.
    // For example by deleting 'wrong' tags or setting up some aliases in szurubooru.
    post.tags = Array.from(document.querySelectorAll("section.tags-row > span.tags"))
      .map((x) => (x as HTMLSpanElement).innerText)
      .map((x) => new ScrapedTag(x));

    // Set source
    post.source = document.location.href;

    result.tryAddPost(post);

    return result;
  }
}
