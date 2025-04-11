import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";
import { CategoryMap } from "./Common.js";
import { createNoteFromDanbooruArticle, guessContentType, parseResolutionString } from "../Utility.js";

// Small hack to avoid screwing with semver
enum Version {
  v020 = 1, // 0.2.0
  v025, // 0.2.5
}

export default class Gelbooru extends ScrapeEngineBase {
  name = "gelbooru";
  features: ScrapeEngineFeature[] = ["content", "rating", "resolution", "tags", "tag_category", "source", "notes"];
  notes = ["Supported features might vary between hosts."];
  supportedHosts = [
    "safebooru.org",
    "gelbooru.com",
    "rule34.xxx",
    "tbib.org",
    "xbooru.com",
    "mspabooru.com",
    "hypnohub.net",
  ];

  private readonly classNameToCategoryMap: CategoryMap = {
    "tag-type-copyright": "copyright",
    "tag-type-character": "character",
    "tag-type-artist": "artist",
    "tag-type-metadata": "meta",
  };

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    let version: Version | null = null;
    switch (document.location.host) {
      case "safebooru.org":
      case "rule34.xxx":
      case "tbib.org":
      case "xbooru.com":
      case "mspabooru.com":
      case "hypnohub.net":
        version = Version.v020;
        break;
      case "gelbooru.com":
        version = Version.v025;
        break;
      default:
        console.error("Couldn't guess version");
        return result;
    }

    this.log("Guessed version: " + version);

    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    Array.from(document.querySelectorAll("li > a"))
      .map((x) => x as HTMLAnchorElement)
      .filter((x) => x && x.innerText == "Original image")
      .map((x) => (post.contentUrl = x.href));

    // Set content type
    if (document.getElementById("gelcomVideoPlayer") != null) {
      post.contentType = "video";
    } else {
      post.contentType = guessContentType(post.contentUrl);
    }

    // Set rating and source
    const regex = new RegExp("(.*): (.*)");
    let statsElements: NodeListOf<Element>;

    if (version == Version.v020) {
      statsElements = document.querySelectorAll("#stats > ul > li");
    } else {
      statsElements = document.querySelectorAll(".tag-list > li");
    }

    for (const idx in statsElements) {
      const el = statsElements[idx] as HTMLLIElement;
      if (el && el.innerText) {
        // matches is an array where (index)
        // 0: full string
        // 1: capture group 1, the type of the statistic. E.g. 'Rating', 'Source'
        // 2: capture group 2, the value of the statistic.
        const matches = el.innerText.match(regex);
        if (matches && matches.length == 3) {
          // If Source element
          if (matches[1] == "Source") {
            if (version == Version.v020) {
              post.sources = [matches[2]];
            } else {
              post.sources = [(el.children[0] as HTMLAnchorElement).href];
            }
          }
          // If Rating element
          else if (matches[1] == "Rating") {
            switch (matches[2].toLowerCase()) {
              case "safe":
                post.rating = "safe";
                break;
              case "sensitive":
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
    }

    // Set tags
    let tagElements: NodeListOf<Element>;

    if (version == Version.v020) {
      tagElements = document.querySelectorAll("#tag-sidebar > li");
    } else {
      tagElements = document.querySelectorAll(".tag-list > li[class^='tag-type']");
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
            // Get the last element, because rule34.xxx also adds a "?" link in front.
            const linkEls = Array.from(el.getElementsByTagName("a"));
            tagName = linkEls[linkEls.length - 1].innerText;
          } else {
            continue;
          }
        } else {
          // First <a> is "?"
          // Second <a> is "actual_tag_name"
          tagName = el.getElementsByTagName("a")[1].innerText;
        }

        let category: TagCategory | undefined;

        // Loop over all classes, because some websites use multiple. E.g. `class="tag tag-type-copyright"`
        for (const className of el.classList) {
          if (this.classNameToCategoryMap[className]) {
            category = this.classNameToCategoryMap[className];
            break;
          }
        }

        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }

    // Try to load notes
    // NOTE: This code is exactly the same as in the Danbooru engine.
    // Which means that when you fix a bug here, you might also want to fix it in the Danbooru engine.
    // Unless the bug is only limited to Gelbooru based sites, of course.
    const noteEls = Array.from(document.querySelectorAll("section#notes > article")).map((x) => x as HTMLElement);

    for (const el of noteEls) {
      const note = createNoteFromDanbooruArticle(post, el);
      if (note) {
        post.notes.push(note);
      }
    }
    // End of code duplication with Danbooru engine.

    result.tryAddPost(post);

    return result;
  }
}
