import { ConstructorOptions, JSDOM } from "jsdom";
import NeoScraper from "./NeoScraper";
import { ScrapeResults } from "./ScrapeEngine";

async function scrapeUrl(url: string) {
  const dom = await JSDOM.fromURL(url);
  return scrapeDom(dom.window.document);
}

async function scrapeEvalUrl(url: string, waitForSelector: string) {
  await page.goto(url);
  await page.waitForSelector(waitForSelector, { visible: true });
  const document = await page.content();
  return scrapeHtml(url, document);
}

async function scrapeHtml(url: string, html: string) {
  const dom = new JSDOM(html, <ConstructorOptions>{ url });
  return scrapeDom(dom.window.document);
}

async function scrapeDom(document: Document) {
  const scraper = new NeoScraper();
  return scraper.scrapeDocument(document);
}

beforeAll(() => {
  // Expose JSDOM Element constructor
  // @ts-ignore
  global.Element = new JSDOM().window.Element;
  // 'Implement' innerText in JSDOM: https://github.com/jsdom/jsdom/issues/1245
  // @ts-ignore
  Object.defineProperty(global.Element.prototype, "innerText", {
    get() {
      return this.textContent.replace(/(\r\n|\n|\r|^\s+|\s+$)/gm, "");
    },
  });
});

test("create scraper with default engines", async () => {
  const scraper = new NeoScraper();
});

test("all default scrapers have unique names", () => {
  const scraper = new NeoScraper();
  let alreadySeen: string[] = [];

  for (const engine of scraper.engines) {
    if (alreadySeen.indexOf(engine.name) != -1) {
      fail(engine.name + " is not a unique name!");
    } else {
      alreadySeen.push(engine.name);
    }
  }
});

// All links are SFW unless stated otherwise

// Anime pictures
describe("anime-pictures.net", () => {
  test("get anime-pictures.net post 729833", async () => {
    const pageUrl = "https://anime-pictures.net/pictures/view_post/729833?lang=en";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://anime-pictures.net/pictures/download_image/729833-4000x6865-arknights-ch%26%2339%3Ben+%28arknights%29-ttk+%28kirinottk%29-single-long+hair-tall+image.jpeg"
    );
  });
});

describe("danbooru", () => {
  test("get danbooru.donmai.us post 3555872", async () => {
    const pageUrl = "https://danbooru.donmai.us/posts/3555872";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://cdn.donmai.us/original/90/33/__flint_girls_und_panzer_and_1_more_drawn_by_omachi_slabco__90332299216db81b8793084e4cb7c15d.jpg"
    );
  });

  test("get danbooru.donmai.us post 4924490", async () => {
    const pageUrl = "https://danbooru.donmai.us/posts/4924490";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://cdn.donmai.us/original/c5/fb/__yuuki_and_tamaki_princess_connect_drawn_by_yuureidoushi_yuurei6214__c5fbc62758d0f1d8c07aac524282434e.png"
    );
    expect(res.posts[0].notes).toHaveLength(17);
    expect(res.posts[0].notes[0].text).toBe("Nya~nya ♪");
  });
});

describe("gelbooru", () => {
  test("get safebooru.org post 2871532", async () => {
    const pageUrl = "https://safebooru.org/index.php?page=post&s=view&id=2871532";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://safebooru.org//images/2757/5f19c7744db918c3d4c4c6035bc65dfa9e18866f.jpg"
    );
  });

  test("get gelbooru.com post 4925055", async () => {
    const pageUrl = "https://gelbooru.com/index.php?page=post&s=view&id=4925055&tags=kimetsu_no_yaiba";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe("https://img3.gelbooru.com/images/3d/03/3d03f6858637805d6473d390a4b1d8c8.jpg");
  });

  test("get rule34.xxx post 2740994", async () => {
    const pageUrl = "https://rule34.xxx/index.php?page=post&s=view&id=2740994";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toContain(".rule34.xxx//images/2472/35bf31c98f53a369c047baf9bae496fb.jpeg");
  });
});

describe("moebooru", () => {
  test("get yande.re post 438510", async () => {
    const pageUrl = "https://yande.re/post/show/438510";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://files.yande.re/image/49b79bc372716a579d8525dcaccb56e2/yande.re%20438510%20landscape%20link%20nintendo%20princess_zelda%20sword%20the_legend_of_zelda%20the_legend_of_zelda%3A_breath_of_the_wild.jpg"
    );
  });

  test("get konachan.com post 289968", async () => {
    const pageUrl = "https://konachan.com/post/show/289968/ahri_-league_of_legends-akali-animal_ears-blonde_h";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe(
      "https://konachan.com/image/e40b38fb704434e4da3eae41e26bca39/Konachan.com%20-%20289968%20akali%20blue_eyes%20breasts%20choker%20cleavage%20evelynn%20foxgirl%20gloves%20group%20hat%20kai%27sa%20long_hair%20microphone%20ponytail%20saphirya%20short_hair%20signed%20watermark.jpg"
    );
  });
});

// Commented out because it doesn't work.
// describe("pixiv", () => {
//   describe("get pixiv post 93964654", () => {
//     const pageUrl = "https://www.pixiv.net/en/artworks/93964654";
//     let res: ScrapeResults;

//     beforeAll(async () => {
//       res = await scrapeEvalUrl(pageUrl, ".gtm-expand-full-size-illust");
//     });

//     it("should grab original image url", async () => {
//       expect(res.posts.length).toBe(1);
//       expect(res.posts[0].pageUrl).toBe(pageUrl);
//       expect(res.posts[0].contentUrl).toBe("https://i.pximg.net/img-original/img/2021/11/07/00/01/02/93964654_p0.jpg");
//     });
//   });
// });

describe("reddit", () => {
  test("get old.reddit.com post", async () => {
    const pageUrl = "https://old.reddit.com/r/IceCreamWaifu/comments/ce0wgh/rtx_2018_neo_luluchan92/";
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toBe("https://i.redd.it/ln8ahz17kpa31.jpg");
  });

  //   test("get new.reddit.com post", async () => {
  //     const pageUrl = "https://new.reddit.com/r/IceCreamWaifu/comments/ce0wgh/rtx_2018_neo_luluchan92/";
  //     const res = await scrapeUrl(pageUrl);
  //     expect(res.posts.length).toBe(1);
  //     expect(res.posts[0].pageUrl).toBe(pageUrl);
  //     expect(res.posts[0].contentUrl).toBe("https://i.redd.it/ln8ahz17kpa31.jpg");
  //   });
});

describe("shimmie2", () => {
  test("get rule34.paheal.net post 2505982", async () => {
    const pageUrl = "https://rule34.paheal.net/post/view/2505982"; // Somewhat sketchy
    const res = await scrapeUrl(pageUrl);
    expect(res.posts.length).toBe(1);
    expect(res.posts[0].pageUrl).toBe(pageUrl);
    expect(res.posts[0].contentUrl).toContain(
      ".paheal.net/_images/15427ab5ed2cddbeef947e30f5c9cab6/2505982%20-%20Kai%27Sa%20League_of_Legends%20lawzilla.png"
    );
  });
});

describe("twitter", () => {
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
});
