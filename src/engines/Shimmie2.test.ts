import { scrapeUrl } from "../test/engine";

test("get rule34.paheal.net post 2505982", async () => {
  const pageUrl = "https://rule34.paheal.net/post/view/2505982"; // Somewhat sketchy
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toContain(
    ".paheal.net/_images/15427ab5ed2cddbeef947e30f5c9cab6/2505982%20-%20Kai%27Sa%20League_of_Legends%20lawzilla.png"
  );
});
