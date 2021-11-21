import { scrapeUrl } from "../test/engine";

test("get e-shuushuu.net post 1063586", async () => {
  const pageUrl = "https://e-shuushuu.net/image/1063586/";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://e-shuushuu.net/images/2021-08-28-1063586.jpeg");
});
