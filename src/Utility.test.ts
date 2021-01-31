import { guessContentType } from "./Utility";

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
