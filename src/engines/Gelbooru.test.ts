import { scrapeUrl } from "../test/engine";

test("get safebooru.org post 2871532", async () => {
  const pageUrl = "https://safebooru.org/index.php?page=post&s=view&id=2871532";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://safebooru.org//images/2757/5f19c7744db918c3d4c4c6035bc65dfa9e18866f.jpg"
  );
});

test("get gelbooru.com post 4925055", async () => {
  const pageUrl = "https://gelbooru.com/index.php?page=post&s=view&id=4925055&tags=kimetsu_no_yaiba";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://img3.gelbooru.com/images/3d/03/3d03f6858637805d6473d390a4b1d8c8.jpg");
});

test("get rule34.xxx post 2740994", async () => {
  const pageUrl = "https://rule34.xxx/index.php?page=post&s=view&id=2740994";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toContain(".rule34.xxx//images/2472/35bf31c98f53a369c047baf9bae496fb.jpeg");
});
