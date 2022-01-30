import { getUrlExtension, guessContentType } from "./Utility";

test("getUrlExtension", () => {
  expect(getUrlExtension("image.png")).toBe("png");
  expect(getUrlExtension("image.jpeg?34")).toBe("jpeg");
  expect(getUrlExtension("image.php?q=test&p=123%204")).toBe("php");

  // I would probably rather have this return an empty string, but maybe some code relies on this functionality?
  expect(getUrlExtension("http://site/index")).toBe("http://site/index");
});

test("guessContentType", () => {
  expect(guessContentType("video.mp4")).toBe("video");
  expect(guessContentType("https://example.com/video.mp4")).toBe("video");
  expect(guessContentType("https://example.com/video.mp4?q=r")).toBe("video");
  expect(guessContentType("https://example.com/video.mp4?q=r&rrr=fss")).toBe("video");
  expect(guessContentType("https://example.com/video.mp4?q=r&rrr=fss,ef./s.e")).toBe("video");
  expect(guessContentType("file://example.com/video.mp4?q=r&rrr=fss,ef./s.e")).toBe("video");
  expect(guessContentType("example.com/video.mp4?q=r&rrr=fss,ef./s.e")).toBe("video");
  expect(guessContentType(".com/video.mp4?q=r&rrr=fss,ef./s.e")).toBe("video");
  expect(guessContentType("c:\\my\\video.mp4?q=r&rrr=fss,ef./s.e")).toBe("video");
  expect(guessContentType("")).toBe("image");
  expect(guessContentType("08435n gf g =0324")).toBe("image");
  expect(guessContentType("https://example.com/.mp4/image.png")).toBe("image");
  expect(guessContentType("https://example.com/file.mp4.png")).toBe("image");
  expect(guessContentType("https://example.com/.mp4.png")).toBe("image");
  expect(guessContentType(undefined as any)).toBe("image");
  expect(guessContentType(null as any)).toBe("image");
  expect(() => guessContentType(984 as any)).toThrow();
});
