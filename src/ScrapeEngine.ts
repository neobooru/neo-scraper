import { TagCategory, SafetyRating } from "./BooruTypes";

export class ScrapedPost {
    imageUrl: string = "";
    source: string = "";
    rating: SafetyRating = "safe";
    tags: ScrapedTag[] = [];
}

export class ScrapedTag {
    name: string = "";
    category?: TagCategory;

    constructor(name: string, category?: TagCategory) {
        this.name = name.replace(/\s/g, "_"); // Replace all spaces with underscores
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
        if (!post.imageUrl) {
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
