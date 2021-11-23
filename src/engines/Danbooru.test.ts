import { scrapeUrl } from "../test/engine";

test("get danbooru.donmai.us post 3555872", async () => {
  const pageUrl = "https://danbooru.donmai.us/posts/3555872";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("omachi_(slabco)", "artist");
  expect(res.posts[0]).toHaveTag("dr_pepper", "copyright");
  expect(res.posts[0]).toHaveTag("flint_(girls_und_panzer)", "character");
  expect(res.posts[0]).toHaveTag("bangs");
  expect(res.posts[0]).toHaveTag("shirt");
  expect(res.posts[0]).toHaveTag("skirt");
  expect(res.posts[0]).toHaveTag("t-shirt");
  expect(res.posts[0]).toHaveTag("long_hair");
  expect(res.posts[0]).toHaveResolution([1142, 1600]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://cdn.donmai.us/original/90/33/__flint_girls_und_panzer_and_1_more_drawn_by_omachi_slabco__90332299216db81b8793084e4cb7c15d.jpg"
  );
});

test("get danbooru.donmai.us post 4924490", async () => {
  const pageUrl = "https://danbooru.donmai.us/posts/4924490";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("yuureidoushi_(yuurei6214)", "artist");
  expect(res.posts[0]).toHaveTag("comic");
  expect(res.posts[0]).toHaveResolution([1000, 2062]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://cdn.donmai.us/original/c5/fb/__yuuki_and_tamaki_princess_connect_drawn_by_yuureidoushi_yuurei6214__c5fbc62758d0f1d8c07aac524282434e.png"
  );
  expect(res.posts[0].notes).toHaveLength(17);
  expect(res.posts[0]).toHaveNote("Nya~nya ♪");
});
