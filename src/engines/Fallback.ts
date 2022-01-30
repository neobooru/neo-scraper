import { ScrapeEngine, ScrapeResult, ScrapedPost, ContentType } from "../ScrapeEngine";
import { guessContentType } from "../Utility";

class MediaElement {
  constructor(
    public readonly contentType: ContentType,
    public readonly contentUrl: string,
    public readonly size: number
  ) {}
}

export default class Fallback implements ScrapeEngine {
  name = "fallback";

  canImport(location: Location): boolean {
    return false;
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);

    // Check if the current page is a link to a video file.
    // If it is then use the document.location.href as media source and immediately return.
    // This is needed because firefox does not add a <source> to a <video> element
    // when going to a direct link. It looks like chromium-based browsers do not have this issue.
    if (guessContentType(document.location.href) == "video") {
      let post = new ScrapedPost();
      post.pageUrl = document.location.href;
      post.contentUrl = document.location.href;
      post.contentType = "video";
      result.posts.push(post);
      return result;
    }

    // Get all img elements.
    const largestImgElement = Array.from(document.getElementsByTagName("img")).map(
      (x) => new MediaElement("image", x.src, x.width * x.height)
    );

    // Get all video elements that have at least one source (child node).
    const largestVideoElement = Array.from(document.getElementsByTagName("video")).flatMap((x) => {
      const source = x.querySelector("source")?.src;
      if (source != undefined) return new MediaElement("video", source, x.videoWidth * x.videoHeight);
      return []; // Skip this item because it does not have a source.
    });

    // Get the largest media element.
    const largestMediaElement = [...largestImgElement, ...largestVideoElement].reduce((a, b) =>
      a?.size > b?.size ? a : b
    );

    if (largestMediaElement) {
      let post = new ScrapedPost();
      post.pageUrl = document.location.href;
      post.contentUrl = largestMediaElement.contentUrl;
      post.contentType = largestMediaElement.contentType;
      result.posts.push(post);
    }

    return result;
  }
}
