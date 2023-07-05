import { scrapeUrl, scrapeEvalUrl } from "../test/engine.js";

test("get yande.re post 438510", async () => {
  const pageUrl = "https://yande.re/post/show/438510";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("the_legend_of_zelda", "copyright");
  expect(res.posts[0]).toHaveTag("link", "character");
  expect(res.posts[0]).toHaveTag("landscape");
  expect(res.posts[0]).toHaveResolution([3000, 1688]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://files.yande.re/image/49b79bc372716a579d8525dcaccb56e2/yande.re%20438510%20landscape%20link%20nintendo%20princess_zelda%20sword%20the_legend_of_zelda%20the_legend_of_zelda%3A_breath_of_the_wild.jpg"
  );
});

test("get yande.re post 684478 with notes", async () => {
  const pageUrl = "https://yande.re/post/show/684478";
  const res = await scrapeEvalUrl(pageUrl, "#image");
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("gym_uniform");
  expect(res.posts[0]).toHaveNote("post #671879");
  expect(res.posts[0]).toHaveResolution([2480, 3508]);
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/artworks/84228323");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://files.yande.re/image/8bdf7c54b0a459acee080f0aeb2a259c/yande.re%20684478%20gym_uniform%20pal_lett.jpg"
  );
});

test("get konachan.com post 289968", async () => {
  const pageUrl = "https://konachan.com/post/show/289968/ahri_-league_of_legends-akali-animal_ears-blonde_h";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("league_of_legends", "copyright");
  expect(res.posts[0]).toHaveResolution([1200, 783]);
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=72418059");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://konachan.com/image/e40b38fb704434e4da3eae41e26bca39/Konachan.com%20-%20289968%20akali%20blue_eyes%20breasts%20choker%20cleavage%20evelynn%20foxgirl%20gloves%20group%20hat%20kai%27sa%20long_hair%20microphone%20ponytail%20saphirya%20short_hair%20signed%20watermark.jpg"
  );
});

test("get konachan.com post 327454 with notes", async () => {
  // We need to use scrapeEvalUrl because otherwise it doesn't work correctly.
  const pageUrl = "https://konachan.com/post/show/327454/apron-brown_hair-building-car-gloves-kexue-long_ha";
  const res = await scrapeEvalUrl(pageUrl, "#image");
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("original");
  expect(res.posts[0]).toHaveTag("kexue");
  expect(res.posts[0]).toHaveTag("water");
  expect(res.posts[0]).toHaveNote("Under construction.  \nBe careful of your safety");
  expect(res.posts[0]).toHaveResolution([5629, 2505]);
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/en/artworks/86644963");
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://konachan.com/image/94a13c8a1fcb9c0f6c9a6c6c5c316259/Konachan.com%20-%20327454%20apron%20brown_hair%20building%20car%20gloves%20kexue%20long_hair%20original%20rain%20see_through%20short_hair%20twintails%20uniform%20water.jpg"
  );
});

test("get konachan.com post 285782 with notes", async () => {
  const pageUrl = "https://konachan.com/post/show/285782/anthropomorphism-bed-black_eyes-blonde_hair-croppe";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("kantai_collection");
  expect(res.posts[0]).toHaveTag("momoniku");
  expect(res.posts[0]).toHaveTag("fang");
  expect(res.posts[0]).toHaveTag("cropped");
  expect(res.posts[0]).toHaveNote("I'M AWAKE!!");
  expect(res.posts[0]).toHaveNote("Poi!");
  expect(res.posts[0]).toHaveNote("Haaah!");
  expect(res.posts[0]).toHaveResolution([1000, 830]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://konachan.com/image/24f5974ad8ed725292ccb3f682181bc1/Konachan.com%20-%20285782%20anthropomorphism%20bed%20black_eyes%20blonde_hair%20cropped%20fang%20kantai_collection%20long_hair%20momoniku%20pajamas%20white%20yuudachi_%28kancolle%29.jpg"
  );
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=75747354");
});

test("get konachan.com post 358247 jpeg and png", async () => {
  const pageUrl = "https://konachan.com/post/show/358247/3d-animal_ears-arknights-black_hair-blonde_hair-br";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(2);
  expect(res.posts[0]).toHaveTag("texas_(arknights)", "character");
  expect(res.posts[0]).toHaveResolution([6144, 3456]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe(
    "https://konachan.com/image/56983a2166a13f4af963774ccd424f0e/Konachan.com%20-%20358247%203d%20arknights%20computer%20couch%20dress%20drink%20gloves%20gun%20halo%20hoodie%20necklace%20pantyhose%20red_eyes%20red_hair%20shirt%20shorts%20skirt%20tie%20twintails%20weapon%20wolfgirl.png"
  );
  expect(res.posts[0]).toHaveSource("https://www.pixiv.net/en/artworks/108925945");

  // JPEG variant
  expect(res.posts[1].contentUrl).toBe(
    "https://konachan.com/jpeg/56983a2166a13f4af963774ccd424f0e/Konachan.com%20-%20358247%203d%20arknights%20computer%20couch%20dress%20drink%20gloves%20gun%20halo%20hoodie%20necklace%20pantyhose%20red_eyes%20red_hair%20shirt%20shorts%20skirt%20tie%20twintails%20weapon%20wolfgirl.jpg"
  );
});
