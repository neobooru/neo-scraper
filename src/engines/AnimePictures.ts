import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { guessContentType, parseResolutionString } from "../Utility";

export default class AnimePictures extends ScrapeEngineBase {
  name = "animepictures";
  features: ScrapeEngineFeature[] = ["content", "resolution", "tags", "tag_category"];
  notes = ["Rating is assumed to be safe."];
  supportedHosts = ["anime-pictures.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;
    

    // Set image url
    const originalImageElements = Array.from(document.getElementsByClassName("download_icon"));

    if (originalImageElements.length > 0) {
      post.contentUrl = (originalImageElements[0] as HTMLAnchorElement).href;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating
    post.rating = "safe"; // Probably

    // Set resolution
    const postContentLinkEls = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("#content > div > .post_content > a")
    );
    const resEl = postContentLinkEls.find((x) => x.href.indexOf("res_x") != -1);
    if (resEl) {
      post.resolution = parseResolutionString(resEl.innerText);
    }

    // Set tags
    const tagElements = Array.from(document.querySelectorAll<HTMLAnchorElement>("ul.tags > li > a"));
    for (const tagElement of tagElements) {
      const tagName = tagElement.innerText;

      let category: TagCategory | undefined;
      for (const className of tagElement.classList) {
        switch (className) {
          case "copyright":
            category = "copyright";
            break;
          case "character":
            category = "character";
            break;
          case "artist":
            category = "artist";
            break;
        }
      }

      if (tagName) {
        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    result.tryAddPost(post);

    return result;
  }
}
