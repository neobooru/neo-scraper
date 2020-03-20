import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

export default class Pixiv implements ScrapeEngine {
    name = "pixiv";

    canImport(url: Location): boolean {
        return (
            url.host == "pixiv.net" ||
            url.host == "www.pixiv.net"
        );
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);

        const imgLinks = Array.from(document.querySelectorAll("div[role='presentation'] > a")).map(x => x as HTMLAnchorElement);
        
        for (const imgLink of imgLinks) {
            let post = new ScrapedPost();
            post.source = document.location.href;
            post.imageUrl = imgLink.href;
            result.tryAddPost(post);
        }

        return result;
    }
}
