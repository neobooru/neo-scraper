import { ScrapeEngine, ScrapeResult, ScrapedPost } from "../ScrapeEngine";

export default class Reddit implements ScrapeEngine {
    name = "reddit";

    canImport(url: Location): boolean {
        return url.host.endsWith("reddit.com");
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        // For old.reddit.com
        const oldLinkElements = document.querySelectorAll("a.title");
        if (oldLinkElements.length > 0) {
            post.imageUrl = (oldLinkElements[0] as HTMLAnchorElement).href;
        }

        // For new reddit
        const newLinkElements = document.querySelectorAll("div[data-test-id='post-content'] > div > a");
        if (newLinkElements.length > 0) {
            post.imageUrl = (newLinkElements[0] as HTMLAnchorElement).href;
        }

        if (post.imageUrl) {
            result.posts.push(post);
        }

        return result;
    }
}
