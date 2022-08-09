import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine";
import { TagCategory } from "../BooruTypes";
import { createNotesFromMoebooruBoxes, guessContentType, parseResolutionString } from "../Utility";

export default class Moebooru extends ScrapeEngineBase {
  name = "moebooru";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags", "tag_category", "source", "notes"];
  notes = [];
  supportedHosts = ["yande.re", "konachan.com"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

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

    result.tryAddPost(post);

    return result;
  }
}
