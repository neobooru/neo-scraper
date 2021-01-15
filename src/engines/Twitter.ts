import { ScrapeEngine, ScrapeResult, ScrapedPost } from "../ScrapeEngine";

export function getOriginalImageUrl(imageUrl: string) {
    const x = imageUrl.replace(/:large|:med|:small|:orig$/, ""); // Remove `:large`, `:small` etc from url
    return x + ":orig"; // Add :orig to url (to get original image)
}

export default class Twitter implements ScrapeEngine {
    name = "twitter";

    canImport(url: Location): boolean {
        return url.host == "twitter.com";
    }

    scrapeDocument(document: Document): ScrapeResult {
        let result = new ScrapeResult(this.name);
        let post = new ScrapedPost();
        post.pageUrl = document.location.href;

        // Set image url
        // When clicked on post (not fullscreen, with post text etc)
        const overlayElement = document.querySelector("#permalink-overlay-dialog");
        if (overlayElement) {
            const cardImageElement = overlayElement.querySelector("div[data-element-context='platform_photo_card'] > img");
            if (cardImageElement) {
                post.imageUrl = getOriginalImageUrl((cardImageElement as HTMLImageElement).src);
            }
        }

        // When clicked on image (fullscreen)
        const mediaImageElements = document.querySelectorAll("div.Gallery-media > img.media-image");
        if (mediaImageElements.length > 0) {
            post.imageUrl = getOriginalImageUrl((mediaImageElements[0] as HTMLImageElement).src);
        }

        result.tryAddPost(post);

        return result;
    }
}
