import { ScrapeResults } from "../ScrapeEngine";
import { scrapeEvalUrl } from "../test/engine";

describe("get twitter.com post", () => {
  const pageUrl = "https://twitter.com/Dishwasher1910/status/1171162651461746688/photo/1";
  let res: ScrapeResults;

  beforeAll(async () => {
    res = await scrapeEvalUrl(pageUrl, "img[alt='Image']");
  });

  it("should grab original image url", async () => {
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe("https://pbs.twimg.com/media/EEDOOCdU0AAHX00?format=jpg&name=orig");
  });
});
