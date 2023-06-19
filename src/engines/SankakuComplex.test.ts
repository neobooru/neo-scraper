import { scrapeUrl } from "../test/engine.js";

test("get chan.sankakucomplex.com post 19614481 with notes", async () => {
  const pageUrl = "https://chan.sankakucomplex.com/post/show/507e986a62cc5b866d92ad491dcfb1a4";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("bangs");
  expect(res.posts[0]).toHaveTag("bare_shoulders");
  expect(res.posts[0]).toHaveTag("solo");
  expect(res.posts[0]).toHaveTag("text");
  expect(res.posts[0]).toHaveTag("idolmaster");
  expect(res.posts[0]).toHaveTag("mayuzumi_fuyuko");
  expect(res.posts[0]).toHaveNote("What are you looking at...");
  expect(res.posts[0]).toHaveNote("What...?");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toContain("sankakucomplex.com/data/50/7e/507e986a62cc5b866d92ad491dcfb1a4.jpg");
});

test("get chan.sankakucomplex.com post 29354061 with notes", async () => {
  // Kinda sketchy
  const pageUrl = "https://chan.sankakucomplex.com/post/show/c8376f02608548365d394a658e85cb3f";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("bangs");
  expect(res.posts[0]).toHaveTag("braid");
  expect(res.posts[0]).toHaveTag("sankuro");
  expect(res.posts[0]).toHaveNote("No.  \nI already told you...");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toContain("sankakucomplex.com/data/c8/37/c8376f02608548365d394a658e85cb3f.jpg");
});
