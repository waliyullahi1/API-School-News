


 const puppeteer = require('puppeteer');



(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: '/tmp',
    });

    const page = await browser.newPage();
    const baseUrl = 'https://schoolnewsng.com/';

    // Navigate to the initial page
    await page.goto(baseUrl, { waitUntil: 'load' });
    await page.waitForSelector('.recent-item');

    const items = [];

    // Scrape data from the current page
    const pageviews = await page.$$('.recent-item');

    for (const pageview of pageviews) {
      try {
        const image = await pageview.$eval('img', (el) => el.getAttribute('src'));
        const eachFullnews = await pageview.$eval('.post-thumbnail a', (el) => el.getAttribute('href'));
        items.push({ image, eachFullnews });
        console.log(items);

        // Separate each URL and process it individually
        for (const fullnews of eachFullnews.split(',')) {
          console.log(fullnews.trim()); // Trim any extra spaces
          try {
            const newsPage = await browser.newPage();
            await newsPage.goto(`${fullnews.trim()}`, { waitUntil: 'networkidle2' });

            // Your scraping logic here (replace this comment)
            // ...

            // Close the new tab (if needed)
            await newsPage.close();
          } catch (error) {
            console.error('Error navigating to:', fullnews, error);
          }
        }
      } catch (error) {
        console.error('Error processing an item:', error);
      }
    }

    console.log('Total items on page 1:', items.length);

    // Close the browser when done
    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

// const puppeteer = require('puppeteer');







// const puppeteer = require('puppeteer');



// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate to the website
//     await page.goto('https://schoolnewsng.com/unilag-postgraduate-admission'); // Replace with the actual URL

//     // Extract all <p> elements within <ul> and <li> tags
//     const scrapedData = await page.evaluate(() => {
//         const paragraphs = [];
//         const ulElements = document.querySelectorAll('ul');
//         ulElements.forEach((ul) => {
//             const liElements = ul.querySelectorAll('li');
//             liElements.forEach((li) => {
//                 const pElements = li.querySelectorAll('p');
//                 pElements.forEach((p) => {
//                     paragraphs.push(p.textContent.trim());
//                 });
//             });
//         });
//         return paragraphs;
//     });

//     console.log(scrapedData); // Display the extracted data

   
// })();




