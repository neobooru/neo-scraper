# Testing notes

## Run all tests in testfiles matching some pattern 

```sh
pnpm test pixiv
```

## Run one specific test ({{describe name}} {{it name}})

```sh
pnpm test pixiv -t "get pixiv post 96268450 \(multipage, expanded\) should find exactly four posts"
```

For some reason you need to escape the parentheses.

## Debug puppeteer tests

```sh
pnpm test:debug # you can add more arguments if you want
```

This will disable headless mode.
Use `await jestPuppeteer.debug();` in the test code to pause code execution.
