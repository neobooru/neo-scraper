import { ScrapeEngine, ScrapeResults } from "./ScrapeEngine";
import * as engines from "./engines";

export default class NeoScraper {
  engines: ScrapeEngine[] = [];
  fallbackEngine: ScrapeEngine | null = null;

  constructor(useDefaultEngines: boolean = true) {
    if (useDefaultEngines) {
      this.engines.push(
        new engines.AnimePictures(),
        new engines.Danbooru(),
        new engines.e621(),
        new engines.Gelbooru(),
        new engines.Moebooru(),
        new engines.Pixiv(),
        new engines.Reddit(),
        new engines.SankakuComplex(),
        new engines.Shimmie2(),
        new engines.Shuushuu(),
        new engines.Twitter(),
        new engines.Zerochan()
      );
      this.fallbackEngine = new engines.Fallback();
    }
  }

  scrapeDocument(
    document: Document,
    engines: string[] | null = null,
    allowFallbackEngine: boolean = false,
    ignoreCanImport: boolean = false
  ): ScrapeResults {
    const res = new ScrapeResults();

    for (const engine of this.engines) {
      if (ignoreCanImport || engine.canImport(document.location)) {
        console.log("Using engine: " + engine.name);
        res.results.push(engine.scrapeDocument(document));
      }
    }

    if (allowFallbackEngine) {
      if (!this.fallbackEngine) {
        console.error("NeoScraper.fallbackEngine is unset!");
      } else {
        console.log("Using fallback engine");
        res.results.push(this.fallbackEngine.scrapeDocument(document));
      }
    }

    console.dir(res);

    return res;
  }
}
