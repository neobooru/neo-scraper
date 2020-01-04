import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

export default class Danbooru implements ScrapeEngine {
    name = "danbooru";

    canImport(url: Location): boolean {
        return (
            url.host == "danbooru.donmai.us" ||
            url.host == "safebooru.donmai.us"
        );
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        const originalImageElements = Array.from(document.querySelectorAll("#post-information > ul > li > a"))
            .filter(x => x.parentElement && x.parentElement.innerText.startsWith("Size"));

        if (originalImageElements.length > 0) {
            post.imageUrl = (originalImageElements[0] as HTMLAnchorElement).href;
        }

        // Set rating
        const safetyExp = new RegExp("Rating: (.*)");
        const safetyElements = Array.from(document.querySelectorAll("#post-information > ul > li"))
            .map(x => x as HTMLLIElement)
            .filter(x => x.innerText.startsWith("Rating"));

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
        const tagElements = Array.from(document.querySelectorAll("#tag-list > ul > li")).map(x => x as HTMLLIElement);
        for (const tagElement of tagElements) {
            let tagName: string | undefined;
            const tagNameElement = tagElement.querySelector(".search-tag") as HTMLAnchorElement;
            if (tagNameElement) {
                tagName = tagNameElement.innerText;
            }

            let category: TagCategory | undefined;
            switch (tagElement.className) {
                case "category-3":
                    category = "copyright";
                    break;
                case "category-4":
                    category = "character";
                    break;
                case "category-1":
                    category = "artist";
                    break;
                case "category-5":
                    category = "meta";
                    break;
            }

            if (tagName) {
                let tag = new ScrapedTag(tagName, category);
                post.tags.push(tag);
            }
        }

        result.tryAddPost(post);

        return result;
    }
}
