const cron = require('node-cron');

const {scrapenews } = require("../controllers/scrape");
// run every 7 hours
function startNewsScraperJob() {
  cron.schedule('0 */7 * * *', async () => {
    console.log('⏰ Running news scraper job:', new Date().toISOString());

    try {
      await scrapenews();
      console.log('✅ News scraper job completed');
    } catch (error) {
      console.error('❌ News scraper job failed:', error.message);
    }
  });

  console.log('📰 News scraper scheduled to run every 7 hours');
}

module.exports = { startNewsScraperJob };