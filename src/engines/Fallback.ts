import { ScrapeEngine, ScrapeResult, ScrapedPost } from "../ScrapeEngine";

export default class Fallback implements ScrapeEngine {
  name = "fallback";

  canImport(location: Location): boolean {
    return false;
  }

  scrapeDocument(document: Document): ScrapeResult {
    function getSize(el: HTMLImageElement) {
      return el.width * el.height;
    }

    // Get largest img element on this page
    const largestImgElement = Array.from(document.getElementsByTagName("img")).reduce((a, b) =>
      getSize(a) > getSize(b) ? a : b
    );

    let result = new ScrapeResult(this.name);

    if (largestImgElement) {
      let post = new ScrapedPost();
      post.pageUrl = document.location.href;
      post.imageUrl = largestImgElement.src;
      result.posts.push(post);
    }

    return result;
  }
}
