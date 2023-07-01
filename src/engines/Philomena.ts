import { ScrapeEngineBase, ScrapeResult, ScrapedPost, ScrapedTag, ScrapeEngineFeature } from "../ScrapeEngine.js";
import { TagCategory } from "../BooruTypes.js";

export default class Philomena extends ScrapeEngineBase {
  name = "Philomena";
  features: ScrapeEngineFeature[] = ["content", "rating", "tags", "source"];
  notes = [];
  supportedHosts = ["derpibooru.org", "trixiebooru.org", "ponybooru.org", "furbooru.org", "ponerpics.org", "manebooru.art", "twibooru.org"];

  scrapeDocument(document: Document): ScrapeResult {
    const result = new ScrapeResult(this.name);
    const post = new ScrapedPost();
    post.pageUrl = document.location.href;

    // Set image url
    const downloadEl = document.querySelector("div[id^='image_meta_'] > div:nth-child(4) > a:nth-child(4)") as HTMLAnchorElement;
    post.contentUrl = downloadEl?.href;

    // Set content type
    if (document.querySelector("video#image-display") != null) {
      post.contentType = "video";
    }

    // Set default rating (Will be determined later)
	post.rating = "unsafe";

    // Set tags
    const tagEls = Array.from(document.querySelectorAll("a.tag__name")).map((x) => x as HTMLLIElement);
	
	for (const el of tagEls) {
      const tagName = (el.innerText);
      let category: TagCategory | undefined;
	  
	  // Set rating (philomena uses tags for this)
	  switch (tagName) {
		case "safe":
			post.rating = "safe";
			break;
	    case "suggestive":
			post.rating = "sketchy";
			break;
	    case "questionable":
			post.rating = "sketchy";
			break;
	    case "explicit":
			post.rating = "unsafe";
			break;
	  }
	  
      if (tagName) {
        const tag = new ScrapedTag(tagName, category);
        post.tags.push(tag);
      }
    }
	
    // Set source
    const sourceEls = Array.from(document.querySelectorAll("a.js-source-link")).map((x) => x as HTMLAnchorElement);
    post.sources = sourceEls.map((x) => x.href);

    result.tryAddPost(post);

    return result;
  }
}
