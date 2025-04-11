import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";
import { createNotesFromMoebooruBoxes, guessContentType, parseResolutionString } from "../Utility.js";

export default class Moebooru extends ScrapeEngineBase {
  name = "moebooru";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags", "tag_category", "source", "notes"];
  notes = [];
  supportedHosts = ["yande.re", "konachan.com", "konachan.net", "sakugabooru.com", "img.genshiken-itb.org"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    if (document.location.host == "yande.re") {
      post.uploadMode = "content";
    }

    // Set image url
    const originalImageElement = document.querySelector("#highres") as HTMLAnchorElement;
    if (originalImageElement) {
      post.contentUrl = originalImageElement.href;
    } else {
      // No point in continuing when we don't have an image.
      return result;
    }

    // Set content type
    post.contentType = guessContentType(post.contentUrl);

    // Set rating and source
    // Same method as Gelbooru v025.
    const regex = new RegExp("(.*): (.*)");
    const statsElements = Array.from(document.querySelectorAll("#stats > ul > li")).map((x) => x as HTMLLIElement);

    for (const el of statsElements) {
      const matches = el.innerText.match(regex);
      if (matches && matches.length == 3) {
        // If Source element
        if (matches[1] == "Source" && el.children.length > 0) {
          post.sources = [(el.children[0] as HTMLAnchorElement).href];
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
        // If size element
        else if (matches[1] == "Size") {
          post.resolution = parseResolutionString(matches[2]);
        }
      }
    }

    // Set tags
    const tagElements = Array.from(document.querySelectorAll("#tag-sidebar > li")).map((x) => x as HTMLLIElement);

    for (const el of tagElements) {
      let tagName: string;
      const tagNameElements = el.getElementsByTagName("a");

      if (tagNameElements.length > 1) {
        // First <a> is "?"
        // (opt) Second <a> is "+" (when logged in)
        // (opt) Third <a> is "-" (when logged in)
        // Last <a> is the actual tag name
        tagName = tagNameElements[tagNameElements.length - 1].innerText;
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

      const tag = new ScrapedTag(tagName, category);
      post.tags.push(tag);
    }

    // Set notes
    const noteBoxSizeEl = document.getElementById("image") as HTMLImageElement;
    if (!noteBoxSizeEl) {
      this.log("noteBoxSizeEl is undefined.");
    } else {
      const boxSize: [number, number] = [noteBoxSizeEl.width, noteBoxSizeEl.height];
      post.notes = createNotesFromMoebooruBoxes(document, boxSize);
    }

    // Sometimes there is both a JPEG and a PNG version of a post.
    // If this is the case, copy all the information from the JPEG
    // version and only replace the contentUrl with the link to the PNG version.
    // We want to add this PNG version before the other version, so that it appears on top.
    const unchangedImgEl = document.querySelector<HTMLAnchorElement>("a.original-file-unchanged");
    if (unchangedImgEl && unchangedImgEl.href != post.contentUrl) {
      const copy = Object.assign(new ScrapedPost(), post);
      copy.contentUrl = unchangedImgEl.href;
      result.tryAddPost(copy);
    }

    // Add normal/non-png post.
    result.tryAddPost(post);

    return result;
  }
}
