const express = require('express');
const puppeteer = require('puppeteer');
// eslint-disable-next-line import/no-extraneous-dependencies
const debug = require('debug')('app:puppeteer');

const grants = 'https://www.grants.gov/custom/search.jsp';

const routes = (app) => {
  const router = express.Router();
  app.use('/', router);
  router.get('/', (req, res) => {
    res.status(200).json({ message: 'Routes works!' });
  });

  router.get('/scraping', async (req, res) => {
    try {
      const opportunities = [];
      const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      ];

      const options = {
        args,
        headless: true,
        ignoreHTTPSErrors: true,
        userDataDir: './tmp',
      };
      const getOpportunitiesAtPage = async (view) => view.evaluate(() => {
        const opportunitiesPage = [];
        const buildOportunity = (row, selector) => {
          const oportunity = {};
          for (let i = 0; i <= 5; i += 1) {
            // eslint-disable-next-line no-undef
            const text = document.getElementsByClassName(selector)[row].children[i].innerText;
            switch (i) {
              case 0:
                oportunity.number = text;
                break;
              case 1:
                oportunity.title = text;
                break;
              case 2:
                oportunity.agency = text;
                break;
              case 3:
                oportunity.status = text;
                break;
              case 4:
                oportunity.postedDate = text;
                break;
              case 5:
                oportunity.closeDate = text;
                break;
              default:
                            // nothing
            }
          }
          return oportunity;
        };

        for (let i = 0; i <= 12; i += 1) {
          opportunitiesPage.push(buildOportunity(i, 'gridevenrow'));
          if (i !== 12) {
            opportunitiesPage.push(buildOportunity(i, 'gridoddrow'));
          }
        }
        return opportunitiesPage;
      });
      const browser = await puppeteer.launch(options);
      const page = await browser.newPage();
      await page.goto(grants, { waitUntil: 'load', timeout: 0 });
      let amountOfopportunities = 0;
      let currentPage = 1;
      do {
        // eslint-disable-next-line no-await-in-loop
        await page.waitFor(1000);
        // eslint-disable-next-line no-await-in-loop
        const currentOpportunities = await getOpportunitiesAtPage(page);
        opportunities.push(...currentOpportunities);
        currentPage += 1;
        amountOfopportunities += 25;
        // eslint-disable-next-line no-await-in-loop
        await page.click(`a[href="javascript:pageSearchResults( '${currentPage}' )"]`);
      } while (amountOfopportunities < 1000);
      await browser.close();
      debug(opportunities);
      debug('amount', opportunities.length);
      res.status(200).json({ data: opportunities, message: 'Scraping works!' });
    } catch (err) {
      debug(err);
      res.status(500).json({ message: "Scraping doesn't work!" });
    }
  });
};

module.exports = routes;
