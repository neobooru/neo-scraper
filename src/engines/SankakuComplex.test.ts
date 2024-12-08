import { scrapeUrl } from "../test/engine.js";

test("get chan.sankakucomplex.com post 19614481 with notes", async () => {
  const pageUrl = "https://chan.sankakucomplex.com/en/posts/porqpNvZBa7";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("bangs");
  expect(res.posts[0]).toHaveTag("bare_shoulders");
  expect(res.posts[0]).toHaveTag("idolmaster");
  expect(res.posts[0]).toHaveTag("mayuzumi_fuyuko");
  // expect(res.posts[0]).toHaveNote("What are you looking at...");
  // expect(res.posts[0]).toHaveNote("What...?");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toContain("sankakucomplex.com/data/50/7e/507e986a62cc5b866d92ad491dcfb1a4.jpg");
});
