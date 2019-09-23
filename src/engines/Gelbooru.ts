import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

// Small hack to avoid screwing with semver
enum Version {
    v020 = 1, // 0.2.0
    v025, // 0.2.5
}

export default class Gelbooru implements ScrapeEngine {
    name = "gelbooru";

    canImport(url: Location): boolean {
        return (
            url.host == "safebooru.org" ||
            url.host == "gelbooru.com" ||
            url.host == "rule34.xxx"
        );
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let version: Version | null = null;
        switch (document.location.host) {
            case "safebooru.org":
            case "rule34.xxx":
                version = Version.v020;
                break;
            case "gelbooru.com":
                version = Version.v025;
                break;
            default:
                console.error("Couldn't guess version");
                return result;
        }

        console.log("Gelbooru guessed version: " + version);

        let post = new ScrapedPost();
        post.source = document.location.href;

        // Set image url
        Array.from(document.querySelectorAll("li > a"))
            .map(x => x as HTMLAnchorElement)
            .filter(x => x && x.innerText == "Original image")
            .map(x => post.imageUrl = x.href);

        // Set rating
        const safetyExp = new RegExp("Rating: (.*)");
        let safetyElements: NodeListOf<Element>;

        if (version == Version.v020) {
            safetyElements = document.querySelectorAll("#stats > ul > li");
        } else {
            safetyElements = document.querySelectorAll("#tag-list > div > li");
        }

        for (const idx in safetyElements) {
            const el = safetyElements[idx] as HTMLLIElement;
            if (el && el.innerText) {
                // matches is an array where (index)
                // 0: full string
                // 1: capture group 1 (rating, so 'Safe', 'Questionable', 'Explicit')
                const matches = el.innerText.match(safetyExp);
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
        }

        // Set tags
        let tagElements: NodeListOf<Element>;

        if (version == Version.v020) {
            tagElements = document.querySelectorAll("#tag-sidebar > li");
        } else {
            tagElements = document.querySelectorAll("#tag-list > div > li[class^='tag-type']");
        }

        for (const idx in tagElements) {
            const el = tagElements[idx] as HTMLLIElement;
            if (el && el.innerText) {
                let tagName: string;

                if (version == Version.v020) {
                    const nameElements = el.getElementsByTagName("a");

                    // Some <li/> don't actually contain a name.
                    // E.g. the sub-headers ("Copyright", "Character", "General", "Meta") on rule34.xxx
                    if (nameElements.length > 0) {
                        tagName = el.getElementsByTagName("a")[0].innerText;
                    }
                    else {
                        continue;
                    }
                } else {
                    // First <a> is "?"
                    // Second <a> is "actual_tag_name"
                    tagName = el.getElementsByTagName("a")[1].innerText;
                }

                let category: TagCategory | undefined;

                switch (el.className) {
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

                let tag = new ScrapedTag(tagName, category);
                post.tags.push(tag);
            }
        }

        if (post.imageUrl) {
            result.posts.push(post);
        }

        return result;
    }
}
