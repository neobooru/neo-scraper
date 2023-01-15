import NeoScraper from "./NeoScraper.js";

test("create scraper with default engines", async () => {
  new NeoScraper();
});

test("all default scrapers have unique names", () => {
  const scraper = new NeoScraper();
  const alreadySeen: string[] = [];

  for (const engine of scraper.engines) {
    if (alreadySeen.indexOf(engine.name) != -1) {
      fail(engine.name + " is not a unique name!");
    } else {
      alreadySeen.push(engine.name);
    }
  }
});
