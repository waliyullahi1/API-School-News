const puppeteer = require('puppeteer');



(async () => {
  try {



    const browser = await puppeteer.launch({
      headless: false, // Set to true for production use
      defaultViewport: null,
      userDataDir: '/tmp',
    });

    const page = await browser.newPage();

    // Enable request interception

    await page.setRequestInterception(true);
    // Define patterns for ad-related requests
    const adPatterns = [
      'adsystem.com', // Add other ad domains as needed
      'doubleclick.net',
      'amazon-adsystem.com',
      // ... (more ad domains)
    ];

    page.on('request', (request) => {
      const url = request.url();
      if (adPatterns.some((pattern) => url.includes(pattern))) {
        request.abort(); // Block the request
      } else {
        request.continue(); // Allow other requests
      }
    });







    const baseUrl = 'https://schoolnewsng.com/';
    await page.goto(baseUrl, { waitUntil: 'load' });
    await page.waitForSelector('.recent-item');


    // Navigate to the initial page


    const items = [];

    for (let title = 2; title <= 10; title++) {

      try {
        await page.waitForSelector('.recent-item');
        const pageviews = await page.$$('.recent-item');
        for (const pageview of pageviews) {
          try {

            const eachFullnews = await pageview.$eval('.post-thumbnail a', (el) => el.getAttribute('href'));
            items.push({ eachFullnews });
            console.log(items);

            // Separate each URL and process it individually
            for (const fullnews of eachFullnews.split(',')) {
              console.log(fullnews.trim()); // Trim any extra spaces
              try {
                const newsPage = await browser.newPage();

                await newsPage.setRequestInterception(true);
                // Define patterns for ad-related requests
                const adPatterns = [
                  'adsystem.com', // Add other ad domains as needed
                  'doubleclick.net',
                  'amazon-adsystem.com',
                  // ... (more ad domains)
                ];

                newsPage.on('request', (request) => {
                  const url = request.url();
                  if (adPatterns.some((pattern) => url.includes(pattern))) {
                    request.abort(); // Block the request
                  } else {
                    request.continue(); // Allow other requests
                  }
                });


                await newsPage.goto(`${fullnews.trim()}`, { waitUntil: 'networkidle2' });
                // Your scraping logic here (replace this comment)
                // ...
                // Close the new tab (if needed)
                await newsPage.close();
              } catch (error) {
                console.error('Errorr navigating to:', fullnews, error);
                break;
              }


            }
          } catch (error) {
            console.error('Erroreee processing an item:', error);
          }
        }
        console.log(title);
        await page.click(`a.page[title="${title}"]`);
        await page.waitForSelector('.recent-item');

      } catch (error) {
        console.error('Error navigating to page', title, ':', error);
        break; // Stop if there's an error (e.g., no more pages)
      }
    }

    console.log('Total items on page 1:', items.length);

    // Close the browser when done

  } catch (error) {
    console.error('An error occurred:', error);
  }
})();