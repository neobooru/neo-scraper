import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { guessContentType, parseResolutionString } from "../Utility.js";

export default class FurAffinity extends ScrapeEngineBase {
  name = "furaffinity";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags", "tag_category"];
  notes = [];
  supportedHosts = ["furaffinity.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // Could use the download button here, but as far as I can tell it doesn't matter.
    const downloadEl = document.querySelector("#submissionImg") as HTMLImageElement;
    post.contentUrl = downloadEl?.src;

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set resolution
    const infoTexts = Array.from(document.querySelector("section.info.text")?.children ?? []);
    const sizeDiv = infoTexts.find((x) => x.querySelector("strong")?.innerText == "Size");
    if (sizeDiv) {
      const resolution = parseResolutionString(sizeDiv.querySelector("span")?.innerText);
      post.resolution = resolution;
    }

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
    post.tags = Array.from(document.querySelectorAll("section.tags-row > span.tags a"))
      .map((x) => (x as HTMLSpanElement).innerText)
      .map((x) => new ScrapedTag(x));

    // Set user who submitted the art as the artist
    const submissionUser = document.querySelector<HTMLElement>(".submission-id-sub-container a")?.innerText;
    if (submissionUser) {
      post.tags.push(new ScrapedTag(submissionUser, "artist"));
    }

    result.tryAddPost(post);

    return result;
  }
}
