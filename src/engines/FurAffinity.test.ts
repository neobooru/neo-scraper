import { scrapeUrl } from "../test/engine";

test("get furaffinity.net post 23281942", async () => {
  const pageUrl = "https://www.furaffinity.net/view/23281942/";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("zac");
  expect(res.posts[0]).toHaveTag("riven");
  expect(res.posts[0]).toHaveTag("pool");
  expect(res.posts[0]).toHaveResolution([1280, 1279]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://d.furaffinity.net/art/nielsdejong/1492781239/1492781239.nielsdejong_pool_party_fun_with_riven_and_zac_by_polkinart.jpg"
  );
});
