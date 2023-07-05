import { scrapeUrl } from "../test/engine.js";

test("get derpibooru.org post 3153524", async () => {
  const pageUrl = "https://derpibooru.org/images/3153524";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].rating).toBe("safe");
  expect(res.posts[0]).not.toHaveTag("safe");
  expect(res.posts[0]).toHaveTag("yay");
  expect(res.posts[0]).toHaveTag("flutteryay");
  expect(res.posts[0]).toHaveSource("https://twitter.com/Confetti_Cakez/status/1674145455666544640");
  expect(res.posts[0]).toHaveResolution([4000, 4000]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://derpicdn.net/img/download/2023/6/29/3153524.jpg");
});

test("get derpibooru.org post 3157356", async () => {
  const pageUrl = "https://derpibooru.org/images/3157356?q=oc";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].rating).toBe("safe");
  expect(res.posts[0]).not.toHaveTag("safe");
  expect(res.posts[0]).toHaveTag("oc");
  expect(res.posts[0]).toHaveTag("serra20", "artist");
  expect(res.posts[0]).toHaveTag("pony", "species");
  expect(res.posts[0]).toHaveTag("eris_(oc)", "character");
  expect(res.posts[0]).toHaveResolution([960, 960]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://derpicdn.net/img/download/2023/7/5/3157356.png");
});
