import { ScrapeEngine, ScrapeResults } from "./ScrapeEngine.js";
import * as engines from "./engines/index.js";

export default class NeoScraper {
  engines: ScrapeEngine[] = [];
  fallbackEngine: ScrapeEngine | null = null;

  constructor(useDefaultEngines = true) {
    if (useDefaultEngines) {
      this.engines.push(
        new engines.AnimePictures(),
        new engines.Danbooru(),
        new engines.e621(),
        new engines.Ehentai(),
        new engines.FurAffinity(),
        new engines.Gelbooru(),
        new engines.Inkbunny(),
        new engines.Moebooru(),
        new engines.Pixiv(),
        new engines.Reddit(),
        new engines.Rule34us(),
        new engines.SankakuComplex(),
        new engines.Shimmie2(),
        new engines.Shuushuu(),
        new engines.Twitter(),
        new engines.Zerochan()
      );
      this.fallbackEngine = new engines.Fallback();
    }
  }

  scrapeDocument(document: Document, allowFallbackEngine = false, ignoreCanImport = false): ScrapeResults {
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
