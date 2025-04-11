import { scrapeUrl } from "../test/engine.js";

test("get safebooru.org post 2871532", async () => {
  const pageUrl = "https://safebooru.org/index.php?page=post&s=view&id=2871532";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("omachi_(slabco)", "artist");
  expect(res.posts[0]).toHaveTag("flint_(girls_und_panzer)", "character");
  expect(res.posts[0]).toHaveTag("bangs");
  expect(res.posts[0]).toHaveTag("shirt");
  expect(res.posts[0]).toHaveTag("skirt");
  expect(res.posts[0]).toHaveTag("t-shirt");
  expect(res.posts[0]).toHaveTag("long_hair");
  expect(res.posts[0]).toHaveResolution([1142, 1600]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].rating).toBe("safe");
  expect(res.posts[0].contentUrl).toContain(
    "https://safebooru.org//images/2757/5f19c7744db918c3d4c4c6035bc65dfa9e18866f.jpg"
  );
});

test("get gelbooru.com post 4925055", async () => {
  const pageUrl = "https://gelbooru.com/index.php?page=post&s=view&id=4925055&tags=kimetsu_no_yaiba";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("maosen", "artist");
  expect(res.posts[0]).toHaveTag("butterfly");
  expect(res.posts[0]).toHaveResolution([720, 1103]);
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/artworks/76853958");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].rating).toBe("sketchy");
  expect(res.posts[0].contentUrl).toContain("gelbooru.com/images/3d/03/3d03f6858637805d6473d390a4b1d8c8.jpg");
});

test("get gelbooru.com post 6225495 with notes", async () => {
  const pageUrl = "https://gelbooru.com/index.php?page=post&s=view&id=6225495";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("hair_up");
  expect(res.posts[0]).toHaveTag("hair_up");
  expect(res.posts[0]).toHaveTag("teeth");
  expect(res.posts[0]).toHaveTag("highres");
  expect(res.posts[0]).toHaveTag("nintendo");
  expect(res.posts[0]).toHaveTag("link");
  expect(res.posts[0]).toHaveTag("ttanuu.");
  expect(res.posts[0]).toHaveNote("I'm fine, more or less.");
  expect(res.posts[0]).toHaveNote("But no need to worry!");
  expect(res.posts[0]).toHaveNote("You're always the best just by being yourself-!!!");
  expect(res.posts[0]).toHaveResolution([1600, 2200]);
  expect(res.posts[0]).toHaveSource("http://www.pixiv.net/member_illust.php?mode=medium&illust_id=88721816");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].rating).toBe("sketchy");
  expect(res.posts[0].contentUrl).toContain("gelbooru.com/images/af/1d/af1dd661fab6714dffc29cb38b6b2269.png");
});

test("get rule34.xxx post 2740994", async () => {
  const pageUrl = "https://rule34.xxx/index.php?page=post&s=view&id=2740994";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts[0]).toHaveTag("fire_emblem", "copyright");
  expect(res.posts[0]).toHaveTag("nintendo", "copyright");
  expect(res.posts[0]).toHaveTag("lucina_(fire_emblem)", "character");
  expect(res.posts[0]).toHaveTag("blue_hair");
  expect(res.posts[0]).toHaveTag("solo");
  expect(res.posts[0]).toHaveResolution([600, 800]);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].rating).toBe("safe");
  expect(res.posts[0].contentUrl).toContain(".rule34.xxx//images/2472/35bf31c98f53a369c047baf9bae496fb.jpeg");
});

test("get xbooru.com post 834083", async () => {
  // Don't worry this isn't a cursed image.
  const pageUrl = "https://xbooru.com/index.php?page=post&s=view&id=834083";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts[0]).toHaveTag("friendship_is_magic", "copyright");
  expect(res.posts[0]).toHaveTag("nurse_redheart", "character");
  expect(res.posts[0]).toHaveTag("nurse");
  expect(res.posts[0]).toHaveTag("standing");
  expect(res.posts[0]).toHaveResolution([1024, 1878]);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].rating).toBe("safe");
  expect(res.posts[0].contentUrl).toContain("https://img.xbooru.com//images/584/040dc1625c094a7d5d7b0918aa0d8324.png");
});
