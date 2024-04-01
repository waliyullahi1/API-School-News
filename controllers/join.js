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


    const news = {
      header: null,
      image:null,
      content:null,
    }

    const items = [];

    for (let title = 2; title <= 30; title++) {

      try {
        await page.waitForSelector('.recent-item');
        const pageviews = await page.$$('.recent-item');
        for (const pageview of pageviews) {
          try {
           
             news.header = await pageview.$eval('.post-thumbnail a', (el) => el.getAttribute('href'));
            news.image = await pageview.$eval('img', (el) => el.getAttribute('src'));
          const title = await pageview.$eval('h3 a', (el) => el.textContent );
            // console.log(items);
           
            // Separate each URL and process it individually
            for (const fullnews of news.header.split(',')) {
              // console.log(fullnews.trim()); // Trim any extra spaces
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
                
             
                // for scrape each full news


                const scrapedData = await newsPage.evaluate(() => {
                  const div = document.querySelector('.entry');  // Replace with your specific div selector
                  const validTags = ['P', 'LI', 'TABLE', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      
                  const filteredElements = Array.from(div.getElementsByTagName('*'))
                      .filter(tag => validTags.includes(tag.tagName));
                  return filteredElements.map(tag => {
                      return tag.outerHTML;  // Return the entire HTML tag as a string
                  });
              });
      
              // Print the extracted content (HTML tags)
              // for (const tag of scrapedData) {
              //     console.log(tag);
              // }

              console.log( `${title}\n ${news.header}\n ${ news.image}\n  ${scrapedData} \n\n\n\n`)

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