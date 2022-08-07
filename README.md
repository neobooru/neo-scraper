# neo-scraper

Scrape a booru-like post object from the DOM.

## Supported sites

| Engine         | Sites                                                         | Features                                                       | Notes                                                         |
| -------------- | ------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| animepictures  | anime-pictures.net                                            | content, resolution, tags, tag_category                        | Rating is assumed to be safe.                                 |
| danbooru       | danbooru.donmai.us, safebooru.donmai.us                       | content, rating, resolution, tags, tag_category, source, notes |                                                               |
| e621           | e621.net, e926.net                                            | content, rating, resolution, tags, tag_category, source        |                                                               |
| furaffinity    | www.furaffinity.net                                           | content, rating, resolution, tags, tag_category                |                                                               |
| gelbooru       | safebooru.org, gelbooru.com, rule34.xxx, tbib.org, xbooru.com | content, rating, resolution, tags, tag_category, source, notes | Supported features might vary between hosts.                  |
| inkbunny       | inkbunny.net                                                  | content, rating, resolution, tags                              |                                                               |
| moebooru       | yande.re, konachan.com                                        | content, rating, resolution, tags, tag_category, source, notes |                                                               |
| pixiv          | pixiv.net, www.pixiv.net                                      | content                                                        |                                                               |
| reddit         | reddit.com, new.reddit.com, old.reddit.com                    | content                                                        |                                                               |
| rule34us       | rule34.us                                                     | content, resolution, tags, tag_category                        | Rating is assumed to be unsafe.                               |
| sankakucomplex | chan.sankakucomplex.com                                       | content, rating, tags, tag_category, notes                     |                                                               |
| shimmie2       | rule34.paheal.net, rule34hentai.net                           | content, tags, source                                          | Rating is assumed to be unsafe.                               |
| shuushuu       | e-shuushuu.net                                                | content, rating, resolution, tags, tag_category                | Rating is assumed to be safe.                                 |
| twitter        | twitter.com, mobile.twitter.com                               | content                                                        |                                                               |
| zerochan       | www.zerochan.net                                              | content, resolution, tags, tag_category                        | Rating is assumed to be safe.                                 |
| fallback       |                                                               | content                                                        | Tries to find the largest image or video on the current page. |
