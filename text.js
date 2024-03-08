// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//         userDataDir: '/tmp',
//       });

//   const page = await browser.newPage();
//   const baseUrl = 'https://schoolnewsng.com/'; // Replace with your base URL

//   // Navigate to the initial page
//   await page.goto(baseUrl);

//   // Get the links
//   const links = await page.$$eval('.recent-item > .post-thumbnail a', links => links.map(l => l.getAttribute('href')));

//   // Create new pages for each link, scrape, and close
//   const pages = [];
//   for (const link of links) {
//     console.log(link);
//     pages.push(await browser.newPage());
//     await pages[pages.length - 1].goto(`${baseUrl}/${link}`);
//     // Your scraping logic here
//     await pages[pages.length - 1].close();
//   }

// //   await browser.close();
// })();

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: '/tmp',
      });
  
      const page = await browser.newPage();
      await page.goto('https://schoolnewsng.com/', {
        waitUntil: 'load',
      });
    


    // Get the links
    const links = await page.$$eval('.recent-item > .post-thumbnail a', links => links.map(l => l.getAttribute('href')));

    // Create new pages for each link, scrape, and close
    const pages = [];
    // for (const link of links) {
    //     console.log(link);
    //     pages.push(await browser.newPage());
    //     await pages[pages.length - 1].goto(`${baseUrl}${link}`); // Corrected URL formation
    //     // Your scraping logic here (e.g., page.waitForSelector, page.$eval, etc.)
    //     await pages[pages.length - 1].close();
    // }

    // Close the browser when done
    await browser.close();
})();

