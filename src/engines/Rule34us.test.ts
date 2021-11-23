import { scrapeUrl } from "../test/engine";

test("get rule34.us post 4646579", async () => {
  // Kinda sketchy.
  const pageUrl = "https://rule34.us/index.php?r=posts/view&id=4646579";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("sciamano240", "artist");
  expect(res.posts[0]).toHaveTag("mario", "character");
  expect(res.posts[0]).toHaveTag("nintendo", "copyright");
  expect(res.posts[0]).toHaveTag("crown");
  expect(res.posts[0]).toHaveTag("solo");
  expect(res.posts[0]).not.toHaveTag("original");
  expect(res.posts[0]).not.toHaveTag("edit");
  expect(res.posts[0]).toHaveResolution([2100, 3000]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://img2.rule34.us/images/91/16/91160933dc1b3c737b3ef4a25b12680d.png");
});
