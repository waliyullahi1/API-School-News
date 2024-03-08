// const puppeteer = require('puppeteer');

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Navigate to the webpage containing the div elements
//         await page.goto('https://schoolnewsng.com/umyu-pre-degree-and-remedial-admission-form/'); // Replace with your target URL

//         // Evaluate the page and extract the text content of div elements with class 'code-block-12'
//         const elements = await page.evaluate(() => {
//             const divs = Array.from(document.querySelectorAll(' .entry'));
//             return divs.map(div => div.textContent.trim());
//         });

//         console.log(elements); // Print the extracted content

//         await browser.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the webpage containing the div elements
        await page.goto('https://schoolnewsng.com/umyu-pre-degree-and-remedial-admission-form/');

        // Evaluate the page and extract specific HTML elements within the specified div
        const scrapedData = await page.evaluate(() => {
            const div = document.querySelector('.entry');  // Replace with your specific div selector
            const validTags = ['P', 'LI', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

            const filteredElements = Array.from(div.getElementsByTagName('*'))
                .filter(tag => validTags.includes(tag.tagName));

            return filteredElements.map(tag => {
                return tag.outerHTML;  // Return the entire HTML tag as a string
            });
        });

        // Print the extracted content (HTML tags)
        for (const tag of scrapedData) {
            console.log(tag);
        }

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();


// const puppeteer = require('puppeteer');

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Navigate to the webpage containing the div elements
//         await page.goto('https://schoolnewsng.com/umyu-pre-degree-and-remedial-admission-form/');  // Replace with your target URL

//         // Evaluate the page and extract specific HTML elements within the specified div
//         const scrapedData = await page.evaluate(() => {
//             const div = document.querySelector('.entry');  // Replace with your specific div selector
//             const validTags = ['P', 'LI', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

//             const filteredElements = Array.from(div.getElementsByTagName('*'))
//                 .filter(tag => validTags.includes(tag.tagName));

//             return filteredElements.map(tag => {
//                 return tag.outerHTML;  // Return the entire HTML tag as a string
//             });
//         });
//         console.log(scrapedData);
//         // Print the extracted content (HTML tags)
//         // for (const tag of scrapedData) {
//         //     console.log(tag);
//         // }

//         await browser.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();



// const puppeteer = require('puppeteer');

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Navigate to the webpage containing the div elements
//         await page.goto('https://schoolnewsng.com/umyu-pre-degree-and-remedial-admission-form/'); // Replace with your target URL

//         // Evaluate the page and extract the elements along with their content
//         const scrapedData = await page.evaluate(() => {
//             const divs = Array.from(document.querySelectorAll('.entry'));

//             return divs.map(div => {
//                 // Extract the tag name and text content
//                 const tagName = div.tagName.toLowerCase();
//                 const textContent = div.textContent.trim();

//                 return { tagName, textContent };
//             });
//         });

//         console.log(scrapedData); // Print the extracted content

//         await browser.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();





// const puppeteer = require('puppeteer');

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Navigate to the webpage containing the div elements
//         await page.goto('https://schoolnewsng.com/umyu-pre-degree-and-remedial-admission-form/'); // Replace with your target URL

//         // Evaluate the page and extract the text content of div elements with class 'code-block-12'
//         const elements = await page.evaluate(() => {
//             const divs = Array.from(document.querySelectorAll('div.entry'));
       
//             return divs.map(div => {
//                 // Exclude nested divs inside this div
//                 const innerDivs = Array.from(div.querySelectorAll('div .entry'));
//                 innerDivs.forEach(innerDiv => innerDiv.remove()); // Remove nested divs
//                 return div.textContent.trim();
//             });
//         });

//         console.log(elements); // Print the extracted content

//         await browser.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();



