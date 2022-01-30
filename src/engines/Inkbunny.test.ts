import { scrapeUrl } from "../test/engine";

test("get inkbunny.net post 2430530", async () => {
  const pageUrl = "https://inkbunny.net/s/2430530";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("comic");
  expect(res.posts[0]).toHaveTag("flower");
  expect(res.posts[0]).toHaveTag("medusa");
  expect(res.posts[0]).toHaveResolution([1062, 1521]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://nl.ib.metapix.net/files/full/3562/3562592_vavacung_medusa.png");
});
