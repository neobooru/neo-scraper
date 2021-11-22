import { TagCategory, SafetyRating } from "./BooruTypes";

export type ContentType = "image" | "video";

export class ScrapedPost {
  contentUrl: string = "";
  pageUrl: string = "";
  contentType: ContentType = "image";
  resolution: [number, number] | undefined;
  rating: SafetyRating = "safe";
  tags: ScrapedTag[] = [];
  notes: ScrapedNote[] = [];
  source: string | undefined;
  referrer: string | undefined;
}

export class ScrapedTag {
  name: string;
  category?: TagCategory;

  constructor(name: string, category?: TagCategory) {
    this.name = name.replace(/\s/g, "_").toLowerCase(); // Replace all spaces with underscores and make everything lowercase
    this.category = category;
  }
}

export class ScrapedNote {
  constructor(public text: string, public polygon: number[][]) {}
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
      console.log(`[${this.engine}] Not adding post because contentUrl is unset!`);
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

export abstract class ScrapeEngineBase implements ScrapeEngine {
  abstract name: string;
  abstract canImport(url: Location): boolean;
  abstract scrapeDocument(document: Document): ScrapeResult;

  protected log(str: string) {
    console.log(`[${this.name}] ${str}`);
  }
}
