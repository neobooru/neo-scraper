import { ScrapeEngine, ScrapeResult, ScrapedPost, ContentType } from "../ScrapeEngine";

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

    let result = new ScrapeResult(this.name);

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
