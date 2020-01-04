import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

export default class Shuushuu implements ScrapeEngine {
    name = "shuushuu";

    canImport(url: Location): boolean {
        return url.host == "e-shuushuu.net";
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        const imgElement = document.querySelector(".thumb_image") as HTMLAnchorElement;
        if (imgElement) {
            post.imageUrl = imgElement.href;
        }

        // Set rating
        post.rating = "safe";

        // Set tags
        const exp = new RegExp(/(.*)_(\w+)/);
        const tagElements = document.getElementsByClassName("quicktag");

        for (const tagElement of tagElements) {
            // id = quicktag1_1009628
            // match[0] = quicktag1_1009628 (aka input str)
            // match[1] = quicktag1
            // match[2] = 1009628
            const match = exp.exec(tagElement.id);
            if (!match || match.length != 3) { continue; }

            let tagCategory: TagCategory | undefined;
            switch (match[1]) {
                // Source, aka copyright
                case "quicktag2":
                    tagCategory = "copyright";
                    break;
                // Artist
                case "quicktag3":
                    tagCategory = "artist";
                    break;
                // Characters
                case "quicktag4":
                    tagCategory = "character";
                    break;
            }

            for (const el of tagElement.children) {
                const tagName = (el?.firstElementChild as HTMLAnchorElement)?.innerText;
                if (tagName) {
                    post.tags.push(new ScrapedTag(tagName, tagCategory));
                }
            }
        }

        result.tryAddPost(post);

        return result;
    }
}
