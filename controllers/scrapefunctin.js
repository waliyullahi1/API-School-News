
const puppeteer = require('puppeteer');
const News = require("../model/news");
 
const {
  uploadToCloudinary,
  uploadImageUrlToCloudinary,
  deleteFromCloudinary
} = require("../utils/upload");




const scrapenews = async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: '/tmp',
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    const adPatterns = [
      'adsystem.com',
      'doubleclick.net',
      'amazon-adsystem.com',
    ];

    page.on('request', (request) => {
      const url = request.url();
      if (adPatterns.some((pattern) => url.includes(pattern))) {
        request.abort();
      } else {
        request.continue();
      }
    });

    for (let pageNumber = 101; pageNumber <= 120; pageNumber++) {
      try {
        console.log(pageNumber, 'page that reach');

        const baseUrl = `https://schoolnewsng.com/page/${pageNumber}/`;
        await page.goto(baseUrl, { waitUntil: 'load' });
        await page.waitForSelector('.recent-item');

        const pageviews = await page.$$('.recent-item');

        for (const pageview of pageviews) {
          try {
            const header = await pageview.$eval('.post-box-title a', el => el.getAttribute('href'));
            const imageUrl = await pageview.$eval('.post-thumbnail img', el => el.getAttribute('src'));
            const newsTitle = await pageview.$eval('.post-box-title a', el => el.textContent.trim());

           

            const newsPage = await browser.newPage();

            try {
              await newsPage.goto(header, { waitUntil: 'networkidle2' });

              const categories = await newsPage.$$eval('.post-cats a', links =>
                links.map(link => link.textContent.trim()).filter(Boolean)
              );

              const title = await newsPage.$eval('.entry-title', el => el.textContent.trim());

              const scrapedData = await newsPage.evaluate(() => {
                const div = document.querySelector('.entry');
                if (!div) return [];

                const validTags = ['P', 'LI', 'TABLE', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

                const filteredElements = Array.from(div.getElementsByTagName('*'))
                  .filter(tag => validTags.includes(tag.tagName));

                return filteredElements.map(tag => tag.outerHTML);
              });

              const contentString = scrapedData.join('\n');

              const plainText = scrapedData
                .map(item => item.replace(/<[^>]*>/g, ' '))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              const excerpt = plainText.slice(0, 220);

              const urlParts = header.split('/').filter(Boolean);
              const slug = urlParts[urlParts.length - 1].toLowerCase().trim();

              const existingNews = await News.findOne({ slug });

              if (existingNews) {
                console.log(`Slug already exists: ${slug} — skipping...`);
                continue;
              }

              const uploadedImage = await uploadImageUrlToCloudinary(imageUrl, "news");

              const news = new News({
                title,
                slug,
                category: categories,
                image: uploadedImage.secure_url,
                imagePublicId: uploadedImage.public_id,
                content: contentString,
                excerpt
              });

             
              await news.save();

            } finally {
              await newsPage.close();
            }

          } catch (error) {
            console.error('Erroreee processing an item:', error);
          }
        }

      } catch (error) {
        console.error('Error navigating to page:', pageNumber, error);
        break;
      }
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = scrapenews