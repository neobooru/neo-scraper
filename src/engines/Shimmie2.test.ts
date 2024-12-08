import { scrapeUrl } from "../test/engine.js";

test("get rule34.paheal.net post 2505982", async () => {
  const pageUrl = "https://rule34.paheal.net/post/view/2505982"; // Somewhat sketchy
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("kai'sa");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0]).toHaveSource(
    "http://law-zilla.tumblr.com/post/171249285285/finished-subdraw-37-kaisa-from-league-of-legends"
  );
  expect(res.posts[0].contentUrl).toContain("https://r34i.paheal-cdn.net");
});
