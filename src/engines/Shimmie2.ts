import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { guessContentType } from "../Utility.js";

export default class Shimmie2 extends ScrapeEngineBase {
  name = "shimmie2";
  features: ScrapeEngineFeature[] = ["content", "tags", "source"];
  notes = ["Rating is assumed to be unsafe."];
  supportedHosts = ["rule34.paheal.net", "rule34hentai.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    // const originalImageElements = Array.from(document.querySelectorAll(".image_info > tbody > tr > td > a"))
    //   .map((x) => x as HTMLAnchorElement)
    //   .filter((x) => x.innerText == "Image Only" || x.innerText == "File Only");

    // if (originalImageElements.length > 0) {
    //   post.contentUrl = originalImageElements[0].href;
    // } else {
    //   const dowloadBtnEl = document.querySelector("a[download]") as HTMLAnchorElement;
    //   if (dowloadBtnEl) {
    //     post.contentUrl = dowloadBtnEl.href;
    //   }
    // }

    // @ts-expect-error
    post.contentUrl = document.getElementById("main_image").src;

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set safety
    post.rating = "unsafe"; // Usually it is unsafe

    // Set tags
    // Shimmie2 doesn't support categories so we don't need to worry about those.
    // They also use uppercase tags, so we toLowerCase() those.
    // Tags might not match with other booru-likes, but that is for the user to figure out.
    // For example by deleting 'wrong' tags or setting up some aliases in szurubooru.
    post.tags = Array.from(document.querySelectorAll("a.tag_name"))
      .map((x) => (x as HTMLAnchorElement).innerText)
      .map((x) => new ScrapedTag(x));

    // Set source
    const sourceEl = document.querySelector(".image_info > tbody > tr > td > div > a") as HTMLAnchorElement;
    if (sourceEl) {
      post.sources = [sourceEl.href];
    }

    result.tryAddPost(post);

    return result;
  }
}
