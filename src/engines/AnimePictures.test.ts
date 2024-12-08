import { scrapeEvalUrl } from "../test/engine.js";

test("get anime-pictures.net post 729833", async () => {
  const pageUrl = "https://anime-pictures.net/posts/729833?lang=en";
  const res = await scrapeEvalUrl(pageUrl, "body");
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("arknights", "copyright");
  expect(res.posts[0]).toHaveTag("ch'en_(arknights)", "character");
  expect(res.posts[0]).toHaveTag("ttk_(kirinottk)", "artist");
  expect(res.posts[0]).toHaveTag("single");
  expect(res.posts[0]).toHaveTag("holding");
  expect(res.posts[0]).toHaveTag("gloves");
  expect(res.posts[0]).toHaveTag("jacket");
  expect(res.posts[0]).toHaveResolution([4000, 6865]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://api.anime-pictures.net/pictures/download_image/729833-4000x6865-arknights-ch'en+(arknights)-ttk+(kirinottk)-single-long+hair-tall+image.jpeg"
  );
});
