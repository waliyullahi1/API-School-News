

  const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
      userDataDir: "/tmp"
   
  });

  const page = await browser.newPage();
  await page.goto('https://www.amazon.co.uk/s?k=airpods+case&adgrpid=1187474265862542&hvadid=74217342315357&hvbmt=bb&hvdev=c&hvlocphy=152653&hvnetw=o&hvqmt=b&hvtargid=kwd-74217389742076&hydadcr=24894_2220811&qid=1707929931&ref=sr_pg_3', {
    waitUntil : 'load'
  });

  const isdisable = await page.$('.s-pagination-item') !== null
  console.log(isdisable);
  
})();
