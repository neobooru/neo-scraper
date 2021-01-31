import { TagCategory, SafetyRating } from "./BooruTypes";

export type ContentType = "image" | "video";

export class ScrapedPost {
  contentUrl: string = "";
  pageUrl: string = "";
  contentType: ContentType = "image";
  rating: SafetyRating = "safe";
  tags: ScrapedTag[] = [];
  source: string | undefined = undefined;
  referrer: string | undefined = undefined;
}

export class ScrapedTag {
  name: string = "";
  category?: TagCategory;

  constructor(name: string, category?: TagCategory) {
    this.name = name.replace(/\s/g, "_").toLowerCase(); // Replace all spaces with underscores and make everything lowercase
    this.category = category;
  }
}

export class ScrapeResult {
  engine: string;
  description: string = "";
  posts: ScrapedPost[] = [];

  constructor(engine: string) {
    this.engine = engine;
  }

  tryAddPost(post: ScrapedPost) {
    if (!post.contentUrl) {
      console.log(`[${this.engine}] Not adding post because imageUrl is unset!`);
    } else {
      this.posts.push(post);
    }
  }
}

export class ScrapeResults {
  results: ScrapeResult[] = [];

  get posts(): ScrapedPost[] {
    var posts: ScrapedPost[] = [];

    for (var res of this.results) {
      posts = posts.concat(res.posts);
    }

    return posts;
  }
}

export interface ScrapeEngine {
  name: string;
  canImport(url: Location): boolean;
  scrapeDocument(document: Document): ScrapeResult;
}
