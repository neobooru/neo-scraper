import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { parseResolutionString } from "../Utility.js";
import Cookies from "js-cookie";

export default class Ehentai extends ScrapeEngineBase {
  name = "E-hentai";
  features: ScrapeEngineFeature[] = ["content", "resolution", "extra_content", "cookies"];
  notes = ["Rating is assumed to be unsafe."];
  supportedHosts = ["e-hentai.org", "exhentai.org"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const imgUrl = document.getElementById("img") as HTMLImageElement;
    if (imgUrl) {
      post.contentUrl = imgUrl.src;
    }

    const originalSourceUrl = document.querySelector("a[href*='fullimg']") as HTMLAnchorElement;
    if (originalSourceUrl) {
      // Set "extra" image url. This URL only gives a good response if the cookies are included.
      // This might also only work on certain accounts.
      post.extraContentUrl = originalSourceUrl.href;

      // Set resolution
      const m = originalSourceUrl.innerText.match(/\d+ x \d+/);
      if (m?.length == 1) {
        post.resolution = parseResolutionString(m[0]);
      }
    }

    // Set rating hardcoded unsafe
    post.rating = "unsafe";

    // No tags available on this page.
    // On the parent page you could probably get some tags, though these don't say anything about the individual image.
    // The tags only say something about the gallery as a whole.

    // Set cookies
    post.cookies = Cookies.get();

    result.tryAddPost(post);

    return result;
  }
}
