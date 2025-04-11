import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { guessContentType } from "../Utility.js";

export function upgradeUrlToOriginalQuality(imgLink: string) {
  if (imgLink.indexOf("img-master") != -1) {
    // Example:
    // Input:  https://i.pximg.net/img-master/img/2022/02/15/06/50/28/96268450_p2_master1200.jpg
    // Input:  https://i.pximg.net/c/600x1200_90_webp/img-master/img/2022/02/15/06/50/28/96268450_p2_master1200.jpg
    // Output: https://i.pximg.net/img-original/img/2022/02/15/06/50/28/96268450_p2.jpg
    //
    // Warning:
    // This will NOT work for a srcset like this:
    // https://i.pximg.net/c/540x540_70/img-master/img/2022/02/15/06/50/28/96268450_p0_master1200.jpg 540w,https://i.pximg.net/img-master/img/2022/02/15/06/50/28/96268450_p0_master1200.jpg
    //
    // See regexr.com/6rcag for an example.

    // TODO: Add a check to verify the newly constructed/guessed url?
    return imgLink.replace(/(https?:\/\/i\.pximg\.net).*\/img-master\/(.*)_master\d+(.*)/, "$1/img-original/$2$3");
  }

  return imgLink;
}

export default class Pixiv extends ScrapeEngineBase {
  name = "pixiv";
  features: ScrapeEngineFeature[] = ["content"];
  notes = [];
  supportedHosts = ["pixiv.net"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const imgLinks = [] as string[];

    // Query for when the user is on the desktop site, is logged in, and has optionally clicked on "Show all".
    // If the user has not clicked on "Show all" then this will only grab the first post.
    imgLinks.push(
      ...Array.from(document.querySelectorAll<HTMLAnchorElement>("div[role='presentation'] > a")).map((x) => x.href)
    );

    if (imgLinks.length == 0) {
      // Query for when the user is on the desktop site and not logged in.
      imgLinks.push(
        ...Array.from(document.querySelectorAll<HTMLImageElement>("div[role='presentation'] img")).map((x) => x.src)
      );
    }

    if (imgLinks.length == 0) {
      // Query for when the user is on the mobile site, and has clicked on "Show all".
      // This only works on pages with multiple posts. The user can optionally be logged in.
      imgLinks.push(
        ...Array.from(document.querySelectorAll<HTMLImageElement>(".manga-page > a > img[data-big]")).map(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (x) => x.getAttribute("data-big")!
        )
      );
    }

    if (imgLinks.length == 0) {
      // Query for when the user is on the mobile site, and has not clicked on "See all" -or- there is only one post.
      const imgLink = document.querySelector<HTMLImageElement>(".work-main-image img")?.src;
      if (imgLink) {
        imgLinks.push(imgLink);
      }
    }

    for (const imgLink of imgLinks) {
      const post = new ScrapedPost();
      post.pageUrl = document.location.href;
      post.contentUrl = upgradeUrlToOriginalQuality(imgLink);
      post.contentType = guessContentType(post.contentUrl);
      post.referrer = document.location.origin;
      result.tryAddPost(post);
    }

    return result;
  }
}
