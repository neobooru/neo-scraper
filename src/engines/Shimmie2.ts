import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";

export default class Shimmie2 implements ScrapeEngine {
    name = "shimmie2";

    canImport(url: Location): boolean {
        return (
            url.host == "rule34.paheal.net" ||
            url.host == "rule34hentai.net"
        );
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        const originalImageElements = Array.from(document.querySelectorAll(".image_info > tbody > tr > td > a"))
            .map(x => x as HTMLAnchorElement)
            .filter(x => x.innerText == "Image Only");

        if (originalImageElements.length > 0) {
            post.imageUrl = originalImageElements[0].href;
        } else {
            const dowloadBtnEl = document.querySelector("a[download]") as HTMLAnchorElement;
            if (dowloadBtnEl) {
                post.imageUrl = dowloadBtnEl.href;
            }
        }

        // Set safety
        post.rating = "unsafe"; // Usually it is unsafe

        // Set tags
        // Shimmie2 doesn't support categories so we don't need to worry about those.
        // They also use uppercase tags, so we toLowerCase() those.
        // Tags might not match with other booru-likes, but that is for the user to figure out.
        // For example by deleting 'wrong' tags or setting up some aliases in szurubooru.
        post.tags = Array.from(document.querySelectorAll("a.tag_name"))
            .map(x => (x as HTMLAnchorElement).innerText)
            .map(x => new ScrapedTag(x));

        result.tryAddPost(post);

        return result;
    }
}
