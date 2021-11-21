import { scrapeUrl } from "../test/engine";

test("get old.reddit.com post", async () => {
  const pageUrl = "https://old.reddit.com/r/IceCreamWaifu/comments/ce0wgh/rtx_2018_neo_luluchan92/";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://i.redd.it/ln8ahz17kpa31.jpg");
});

test("get new.reddit.com post", async () => {
  const pageUrl = "https://new.reddit.com/r/IceCreamWaifu/comments/ce0wgh/rtx_2018_neo_luluchan92/";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://i.redd.it/ln8ahz17kpa31.jpg");
});
