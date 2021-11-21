import { ScrapeResults } from "../ScrapeEngine";
import { scrapeEvalUrl } from "../test/engine";

describe("get pixiv post 93964654", () => {
  const pageUrl = "https://www.pixiv.net/en/artworks/93964654";
  let res: ScrapeResults;

  beforeAll(async () => {
    res = await scrapeEvalUrl(pageUrl, ".gtm-expand-full-size-illust");
  });

  it("should grab original image url", async () => {
    pending("Test does not work.");
    // expect(res.posts.length).toBe(1);
    // expect(res.posts[0].pageUrl).toBe(pageUrl);
    // expect(res.posts[0].contentUrl).toBe("https://i.pximg.net/img-original/img/2021/11/07/00/01/02/93964654_p0.jpg");
  });
});
