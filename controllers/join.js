



const puppeteer = require('puppeteer');
const axios = require('axios');
const News = require('../model/Fullnews'); 
const   saveImageToS3 = require('./s3')

const scrapenews = async (req, res)=>{
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







   


    // Navigate to the initial page


    const items = [];

    for (let title = 1; title <= 30; title++) {

      const baseUrl =`https://schoolnewsng.com/page/${title}/`;
      await page.goto(baseUrl, { waitUntil: 'load' });
      await page.waitForSelector('.recent-item');
      try {
        await page.waitForSelector('.recent-item');
        const pageviews = await page.$$('.recent-item');
        for (const pageview of pageviews) {
          try {
           
           const  header = await pageview.$eval('.post-thumbnail a', (el) => el.getAttribute('href'));
           const imageUrl = await pageview.$eval('img', (el) => el.getAttribute('src'));
          const title = await pageview.$eval('h3 a', (el) => el.textContent );
            // console.log(items);
           const route = header.split('/')
           
            // Separate each URL and process it individually
            for (const fullnews of header.split(',')) {
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
              console.log(scrapedData, title, imageUrl, 'gggg', route[3]);
             
          //  const imag =   await saveImageToS3(imageUrl)
          //     const contentString = scrapedData.join('\n'); const news = new News({
          //       title:title,
          //       image: imag,
          //       content:contentString
          //     })
          await newsPage.close();
              // news.save()
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
        // await page.click(`a.page[title="${title}"]`);
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
};

module.exports = scrapenews