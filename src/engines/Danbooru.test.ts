import { scrapeUrl } from "../test/engine";

test("get danbooru.donmai.us post 3555872", async () => {
  const pageUrl = "https://danbooru.donmai.us/posts/3555872";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://cdn.donmai.us/original/90/33/__flint_girls_und_panzer_and_1_more_drawn_by_omachi_slabco__90332299216db81b8793084e4cb7c15d.jpg"
  );
});

test("get danbooru.donmai.us post 4924490", async () => {
  const pageUrl = "https://danbooru.donmai.us/posts/4924490";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://cdn.donmai.us/original/c5/fb/__yuuki_and_tamaki_princess_connect_drawn_by_yuureidoushi_yuurei6214__c5fbc62758d0f1d8c07aac524282434e.png"
  );
  expect(res.posts[0].notes).toHaveLength(17);
  expect(res.posts[0].notes[0].text).toBe("Nya~nya ♪");
});
