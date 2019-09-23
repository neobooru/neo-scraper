import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

export default class Moebooru implements ScrapeEngine {
    name = "moebooru";

    canImport(url: Location): boolean {
        return (
            url.host == "yande.re" ||
            url.host == "konachan.com"
        );
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        const originalImageElement = document.querySelector("#highres") as HTMLAnchorElement;
        if (originalImageElement) {
            post.imageUrl = originalImageElement.href;
        }

        // Set safety
        // Same method as Gelbooru but cleaner code
        const safetyExp = new RegExp("Rating: (.*)");
        const safetyElements = Array.from(document.querySelectorAll("#stats > ul > li"))
            .map(x => x as HTMLLIElement)
            .filter(x => x.innerText.startsWith("Rating:"));

        if (safetyElements.length > 0) {
            const matches = safetyElements[0].innerText.match(safetyExp);
            if (matches && matches.length > 0) {
                switch (matches[1].toLowerCase()) {
                    case "safe":
                        post.rating = "safe";
                        break;
                    case "questionable":
                        post.rating = "sketchy";
                        break;
                    case "explicit":
                        post.rating = "unsafe";
                        break;
                }
            }
        }

        // Set tags
        const tagElements = Array.from(document.querySelectorAll("#tag-sidebar > li"))
            .map(x => x as HTMLLIElement);

        for (const el of tagElements) {
            let tagName: string;
            let tagNameElements = el.getElementsByTagName("a");

            if (tagNameElements.length > 1) {
                // First <a> is "?"
                // Second <a> is "actual_tag_name"
                tagName = tagNameElements[1].innerText;
            } else {
                // Skip if no tag name is found
                continue;
            }

            let category: TagCategory | undefined;

            // Loop over all classes because some sites (konachan)
            // have mutliple classes, e.g. "tag-link tag-type-copyright"
            for (const className of Array.from(el.classList)) {
                switch (className) {
                    case "tag-type-copyright":
                        category = "copyright";
                        break;
                    case "tag-type-character":
                        category = "character";
                        break;
                    case "tag-type-artist":
                        category = "artist";
                        break;
                    case "tag-type-metadata":
                        category = "meta";
                        break;
                }
            }

            let tag = new ScrapedTag(tagName, category);
            post.tags.push(tag);
        }
        
        
        if (post.imageUrl) {
            result.posts.push(post);
        }

        return result;
    }
}
