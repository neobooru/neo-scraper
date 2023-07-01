import { scrapeUrl } from "../test/engine.js";

test("get derpibooru.org post 3153524", async () => {
  const pageUrl = "https://derpibooru.org/images/3153524";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("safe");
  expect(res.posts[0]).toHaveTag("yay");
  expect(res.posts[0]).toHaveTag("flutteryay");
  expect(res.posts[0]).toHaveSource("https://twitter.com/Confetti_Cakez/status/1674145455666544640");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://derpicdn.net/img/download/2023/6/29/3153524.jpg");
});
