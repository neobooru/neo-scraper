import { scrapeUrl } from "../test/engine";

test("get anime-pictures.net post 729833", async () => {
  const pageUrl = "https://anime-pictures.net/pictures/view_post/729833?lang=en";
  const res = await scrapeUrl(pageUrl);
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
    "https://anime-pictures.net/pictures/download_image/729833-4000x6865-arknights-ch%26%2339%3Ben+%28arknights%29-ttk+%28kirinottk%29-single-long+hair-tall+image.jpeg"
  );
});
