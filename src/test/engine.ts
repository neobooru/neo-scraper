import { JSDOM, ConstructorOptions } from "jsdom";
import NeoScraper from "../NeoScraper.js";

export const MobileUserAgent = "Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/103.0";

/**
 * Go to an URL and parse it's raw HTML without executing any client-side code.
 * @param url
 * @returns
 */
export async function scrapeUrl(url: string) {
  const dom = await JSDOM.fromURL(url);
  return scrapeDom(dom.window.document);
}

/**
 * Go to an URL and evaluate the page using Puppeteer.
 * @param url
 * @param waitForSelector
 * @returns
 */
export async function scrapeEvalUrl(url: string, waitForSelector: string, userAgent: string | undefined = undefined) {
  await jestPuppeteer.resetPage();

  if (userAgent) {
    page.setUserAgent(userAgent);
  }

  await page.goto(url);
  await page.waitForSelector(waitForSelector, { visible: true });
  return scrapePage(url, page);
}

export async function scrapePage(url: string, page: any) {
  const document = await page.content();
  return scrapeHtml(url, document);
}

async function scrapeHtml(url: string, html: string) {
  const dom = new JSDOM(html, <ConstructorOptions>{ url });
  return scrapeDom(dom.window.document);
}

async function scrapeDom(document: Document) {
  const scraper = new NeoScraper();
  return scraper.scrapeDocument(document);
}
