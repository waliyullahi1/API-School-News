



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

    for (let title = 1; title <= 200; title++) {

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
          
           const route = header.split('/')
        const image =  await  saveImageToS3(imageUrl)
            console.log(route[3], 'fffffff');
            for (const fullnews of header.split(',')) {
           
              try {
                const newsPage = await browser.newPage();

                await newsPage.setRequestInterception(true);
              
                const adPatterns = [
                  'adsystem.com', 
                  'doubleclick.net',
                  'amazon-adsystem.com',
               
                ];

                newsPage.on('request', (request) => {
                  const url = request.url();
                  if (adPatterns.some((pattern) => url.includes(pattern))) {
                    request.abort(); 
                  } else {
                    request.continue(); 
                  }
                });


                await newsPage.goto(`${fullnews.trim()}`, { waitUntil: 'networkidle2' });
                
             
               


                const scrapedData = await newsPage.evaluate(() => {
                  const div = document.querySelector('.entry');  
                  const validTags = ['P', 'LI', 'TABLE', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      
                  const filteredElements = Array.from(div.getElementsByTagName('*'))
                      .filter(tag => validTags.includes(tag.tagName));
                  return filteredElements.map(tag => {
                      return tag.outerHTML;  
                  });
              });
               console.log(scrapedData, title, imageUrl, 'gggg', route[3],`\n\n\n`);
             
      
              const contentString = scrapedData.join('\n');
           const news = new News({
                title:title,
                image: image,
                content:contentString,
                route:route[3]
              })
               news.save()
               console.log(news)
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
        // await page.click(`a.page[title="${title}"]`);
        await page.waitForSelector('.recent-item');

      } catch (error) {
        console.error('Error navigating to page', title, ':', error);
        break; 
      }
    }

    console.log('Total items on page 1:', items.length);

    

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

module.exports = scrapenews