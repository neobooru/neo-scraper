import { scrapeUrl } from "../test/engine.js";

test("get zerochan.net post 2934998", async () => {
  const pageUrl = "https://www.zerochan.net/2934998";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("nintendo", "copyright");
  expect(res.posts[0]).toHaveTag("akihorisu", "artist");
  expect(res.posts[0]).toHaveTag("shirona_(pokémon)", "character");
  expect(res.posts[0]).toHaveResolution([1186, 1009]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://static.zerochan.net/Shirona.%28Pok%C3%A9mon%29.full.2934998.png");
});

test("get zerochan.net gif post 3511809", async () => {
  const pageUrl = "https://www.zerochan.net/4356451";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("honkai_star_rail");
  expect(res.posts[0]).toHaveResolution([2192, 1644]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://static.zerochan.net/Honkai.Star.Rail.full.4356451.jpg");
});
