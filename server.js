// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "/tmp"
//   });

//   const page = await browser.newPage();
//   await page.goto('https://www.amazon.co.uk/s?k=airpods+case&adgrpid=1187474265862542&hvadid=74217342315357&hvbmt=bb&hvdev=c&hvlocphy=152653&hvnetw=o&hvqmt=b&hvtargid=kwd-74217389742076&hydadcr=24894_2220811&qid=1707929931&ref=sr_pg_3',{
//     waitUntil:'load'
//   });
//   await page.waitForSelector(' .s-result-item '); // wait for the elements to be loaded
//   const pageview = await page.$$(' .s-result-item .sg-col-inner ');
//   let items = []
//   let image = null
//   let title = null
//   const itIsDesable = false
//   while(!itIsDesable){
//     for (const pageviews of pageview) {
//       // use try...catch to handle errors
//       try {
  
//         // use pageviews.$eval to pass the element handle
//        image = await pageviews.$eval('.s-image ', el => el.getAttribute('src'));
//        title = await pageviews.$eval('span', el => el.textContent);
//         if (items !== null) {
//            items.push({ image, title });
//         }
       
//         // const isdisable = await page.$$(' .s-pagination-item  .s-pagination-disabled ') !== null ;
//         // console.log(isdisable);
//         // itIsDesable = isdisable
//         // use items.push to add the data to the array
 
       
//       } catch (error) {
//          console.log(error);
//       }
//       await page.waitForSelector('.s-pagination-button ', {visible : true})
//       await page.click(' .s-pagination-button ')
//     }
//    }
//   // for (const pageviews of pageview) {
//   //   // use try...catch to handle errors
//   //   try {

//   //     // use pageviews.$eval to pass the element handle
//   //    image = await pageviews.$eval('.s-image ', el => el.getAttribute('src'));
//   //    title = await pageviews.$eval('span', el => el.textContent);
    
//   //     // use items.push to add the data to the array
//   //     items.push({ image, title });
//   //   } catch (error) {
//   //     // console.log(error);
//   //   }
//   // }
//   console.log(items); // print the items array
//   console.log(items.length);
// })();




// const loginToFiverr = async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Set user agent to mimic a browser from the USA
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

//     // Navigate to Fiverr login page
//     await page.goto('https://www.fiverr.com/login', { waitUntil: 'load' });

//     // Fill in your username and password
//     // await page.type('#username', 'your_username');
//     // await page.type('#password', 'your_password');

//     // Click the login button
//     // await page.click('#login');

//     // Wait for 1 minute (adjust as needed)
//     await page.waitForTimeout(60000);

//     // Refresh the page
//     // await page.reload({ waitUntil: 'load' });

//     // Take a screenshot (optional)
//     await page.screenshot({ path: 'fiverr_page.png' });

//     // Close the browser
//     await browser.close();
// };

// loginToFiverr();

const puppeteer = require('puppeteer');

async function keepFiverrOnline() {
  const browser = await puppeteer.launch({
        headless: false,
       defaultViewport: false,
       userDataDir: "/tmp"
      }); // Set headless to true for production
  const page = await browser.newPage();
  // Set the browser location to a USA IP address (45.87.214.71)
  // await page.setGeolocation({ latitude: 45.87, longitude: 214.71 });

  // Navigate to Fiverr login page
  await page.goto('https://www.fiverr.com/login');

  await page.waitForSelector('.ipXM0u3 .BEWtDu1 .cNh938Y .icon-button .EVCR5Os ', {visible : true})
      await page.click(' .ipXM0u3 BEWtDu1 cNh938Y icon-button EVCR5Os ')
    
  // Fill in your email and password
  // await page.type('#email-input', 'your_email');
  // await page.type('#password-input', 'your_password');
  // await page.click('#login-button');
  
  // Set the browser location to a USA IP address (45.87.214.71)
  // await page.setGeolocation({ latitude: 45.87, longitude: 214.71 });

  // Periodically reload the page (e.g., every 2 minutes)
  setInterval(async () => {
    await page.reload();
    console.log('Page reloaded.');
  }, 2 * 60 * 1000); // 2 minutes

  // Keep the script running indefinitely
  // (You can deploy this on Vercel or any other server)

  // Close the browser when done
  // await browser.close();
}

keepFiverrOnline();





