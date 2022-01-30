import { scrapeUrl } from "../test/engine";

test("get e621.net post 380315", async () => {
  const pageUrl = "https://e621.net/posts/380315?q=league_of_legends+rating%3Asafe+order%3Ascore";
  const res = await scrapeUrl(pageUrl);
  expect(res.posts.length).toBe(1);
  expect(res.posts[0]).toHaveTag("inkinesss", "artist");
  expect(res.posts[0]).toHaveTag("nasus_(lol)", "character");
  expect(res.posts[0]).toHaveTag("ambiguous_gender");
  expect(res.posts[0]).toHaveTag("low_res", "meta");
  expect(res.posts[0]).toHaveResolution([500, 500]);
  expect(res.posts[0].pageUrl).toBe(pageUrl);
  expect(res.posts[0].contentUrl).toBe("https://static1.e621.net/data/92/e7/92e71bd73ab219d80516c4d9adad3db5.jpg");
});
