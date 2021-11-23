import { scrapeUrl } from "../test/engine";

test("get e-shuushuu.net post 1063586", async () => {
  const pageUrl = "https://e-shuushuu.net/image/1063586/";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("monster");
  expect(res.posts[0]).toHaveTag("wings");
  expect(res.posts[0]).toHaveTag("celebi", "character");
  expect(res.posts[0]).toHaveTag("shiina_mirin", "artist");
  expect(res.posts[0]).toHaveTag("pokémon", "copyright");
  expect(res.posts[0]).toHaveResolution([1447, 1023]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://e-shuushuu.net/images/2021-08-28-1063586.jpeg");
});
