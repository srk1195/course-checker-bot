const puppeteer = require('puppeteer');
const debug = require('debug')('app: CourseStatus: 📚 ');
const { puppeteerConfig } = require('./config');

async function webScrape({ url, selector, xpath }) {
  const browser = await puppeteer.launch(puppeteerConfig);

  const page = await browser.newPage();

  await page
    .goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    })
    .then(() => debug('Page loaded!!'));

  await page
    .waitForSelector(selector)
    .then(() => debug('selector appeared'))
    .catch((err) => {
      debug('Unable to fetch the value');
      debug(err);
      browser.close();
    });

  const [el] = await page.$x(xpath);

  const txt = await el.getProperty('textContent');
  const underlyingValue = await txt.jsonValue();

  await browser.close();

  return underlyingValue;
}

// webScrape(courses.Fall[0])
//   .then(() => {
//     debug('Perfectyl occured!');
//   })
//   .catch((err) => {
//     debug(err);
//   });

module.exports = webScrape;
