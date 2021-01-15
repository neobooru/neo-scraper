import { ScrapeEngine, ScrapeResult, ScrapedPost, ScrapedTag } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";

export default class Moebooru implements ScrapeEngine {
  name = "moebooru";

  canImport(url: Location): boolean {
    return url.host == "yande.re" || url.host == "konachan.com";
  }

  scrapeDocument(document: Document): ScrapeResult {
    let result = new ScrapeResult(this.name);
    let post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const originalImageElement = document.querySelector("#highres") as HTMLAnchorElement;
    if (originalImageElement) {
      post.imageUrl = originalImageElement.href;
    }

    // Set rating and source
    // Same method as Gelbooru v025.
    const regex = new RegExp("(.*): (.*)");
    const statsElements = Array.from(document.querySelectorAll("#stats > ul > li")).map((x) => x as HTMLLIElement);

    for (const el of statsElements) {
      const matches = el.innerText.match(regex);
      if (matches && matches.length == 3) {
        // If Source element
        if (matches[1] == "Source") {
          post.source = (el.children[0] as HTMLAnchorElement).href;
        }
        // If Rating element
        else if (matches[1] == "Rating") {
          switch (matches[2].toLowerCase()) {
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
    const tagElements = Array.from(document.querySelectorAll("#tag-sidebar > li")).map((x) => x as HTMLLIElement);

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

    result.tryAddPost(post);

    return result;
  }
}
