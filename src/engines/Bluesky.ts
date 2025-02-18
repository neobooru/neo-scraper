import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapeEngineFeature } from "../ScrapeEngine.js";

function getFullSizeImg(link: string) {
  return link.replace("/feed_thumbnail/", "/feed_fullsize/");
}

export default class Bluesky extends ScrapeEngineBase {
  name = "bluesky";
  features: ScrapeEngineFeature[] = ["content"];
  notes = [];
  supportedHosts = ["bsky.app"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const imgEls = Array.from<HTMLImageElement>(document.querySelectorAll("div > img"));

    let els = imgEls.filter((x) => x.src.indexOf("feed_fullsize") != -1);

    // Only add the 'normal' feed elements if no post is in fullscreen.
    if (els.length == 0) {
      this.log("Post is not fullscreen.");
      els = imgEls.filter((x) => x.src.indexOf("feed") != -1);
    }

    for (const el of els) {
      const post = new ScrapedPost();
      post.pageUrl = document.location.href;
      post.contentUrl = getFullSizeImg(el.src);
      result.tryAddPost(post);
    }

    return result;
  }
}
