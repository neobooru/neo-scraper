import { scrapeUrl } from "../test/engine";

test("get yande.re post 438510", async () => {
  const pageUrl = "https://yande.re/post/show/438510";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://files.yande.re/image/49b79bc372716a579d8525dcaccb56e2/yande.re%20438510%20landscape%20link%20nintendo%20princess_zelda%20sword%20the_legend_of_zelda%20the_legend_of_zelda%3A_breath_of_the_wild.jpg"
  );
});

test("get konachan.com post 289968", async () => {
  const pageUrl = "https://konachan.com/post/show/289968/ahri_-league_of_legends-akali-animal_ears-blonde_h";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://konachan.com/image/e40b38fb704434e4da3eae41e26bca39/Konachan.com%20-%20289968%20akali%20blue_eyes%20breasts%20choker%20cleavage%20evelynn%20foxgirl%20gloves%20group%20hat%20kai%27sa%20long_hair%20microphone%20ponytail%20saphirya%20short_hair%20signed%20watermark.jpg"
  );
});
