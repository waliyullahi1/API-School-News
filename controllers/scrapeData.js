const scrapeage = async (div) => {
    const scrapedData = await newsPage.evaluate(() => {
        const div = document.querySelector(`${entry}`);  // Replace with your specific div selector
        const validTags = ['P', 'LI', 'TABLE', 'OL', 'UL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

        const filteredElements = Array.from(div.getElementsByTagName('*'))
            .filter(tag => validTags.includes(tag.tagName));
        return filteredElements.map(tag => {
            return tag.outerHTML;  // Return the entire HTML tag as a string
        });
    });
    
   return scrapedData
  };
  
  module.exports =  scrapeage ;
  