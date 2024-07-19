# Scraping Printi website with Playwright

Title says it all :)

## How to configure

This script was written to work with the personalised magazine product, but fiddling a little can make it work with any product.

1. Go to Printi website and navigate to the product configurator
2. Copy the URL
3. Paste the URL in `index.js` `config` object.
4. Copy (for now, manually) the property options and fill them in the `config` object.
5. In my use-case, I left some options out, and didn't fill all categories because they had a single pre-selected option.
6. Change `headless` to `false` to see the magic happening in a browser.
7. The script takes some hours to complete — scraping this website is not fast — so setting `headless: true` makes it slightly faster.

## How to run

1. Run `npm install`.
2. Run `npx playwright install`.
3. Run `node index.js` to launch Playwright and have an exported CSV: `output.csv`.

## Collaboration

Please add PRs if you think this code was useful. Possible improvements:

- Programatically catch `config` properties and values
- Dynamic page numbers (now they're hardcoded to 50, 100, and 150)
- Can Playwright run concurrently? If yes, this would make the process _way_ faster.