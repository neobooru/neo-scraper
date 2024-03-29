import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";

export default class Inkbunny extends ScrapeEngineBase {
  name = "inkbunny";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags"];
  notes = [];
  supportedHosts = ["inkbunny.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector("a[download]") as HTMLAnchorElement;

    if (downloadEl) {
      post.contentUrl = downloadEl.href;
    }

    // Sometimes the HTML structure is different for whatever reason?
    if (!post.contentUrl) {
      const imgEl = document.querySelector(".widget_imageFromSubmission > img") as HTMLImageElement;
      if (imgEl) {
        post.contentUrl = imgEl.src;
      }
    }

    // Return early if we didn't find an image.
    if (!post.contentUrl) {
      return result;
    }

    // Set post resolution
    const width = parseInt((<HTMLInputElement>document.getElementById("submission-origwidth"))?.value);
    const height = parseInt((<HTMLInputElement>document.getElementById("submission-origheight"))?.value);
    if (!isNaN(width) && !isNaN(height)) {
      post.resolution = [width, height];
    }

    // Set rating
    const ratingExp = new RegExp("Rating: (.*)");
    const spanEls = Array.from(document.querySelectorAll("div > span"));
    const ratingEls = spanEls.map((x) => x as HTMLDivElement).filter((x) => x.innerText.indexOf("Rating:") != -1);

    if (ratingEls.length > 0) {
      const matches = ratingEls[0].parentElement?.innerText.match(ratingExp);
      if (matches && matches.length > 0) {
        switch (matches[1].toLowerCase()) {
          case "general":
            post.rating = "safe";
            break;
          case "mature":
          case "adult":
            post.rating = "unsafe";
            break;
        }
      }
    }

    // Set tags
    const metaKeywords = document.querySelector("meta[name='keywords']") as HTMLMetaElement;
    const keywordsContent = metaKeywords.getAttribute("content");

    if (keywordsContent) {
      const keywords = keywordsContent.split(",").map((x) => x.trim());

      for (const keyword of keywords) {
        const tag = new ScrapedTag(keyword);
        post.tags.push(tag);
      }
    }

    result.tryAddPost(post);

    return result;
  }
}
