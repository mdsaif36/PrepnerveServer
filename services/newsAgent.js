const Parser = require('rss-parser');
const pool = require('../db'); 

const parser = new Parser();

const TECH_FEEDS = [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://wired.com/feed/rss",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.cnbc.com/id/19854910/device/rss/rss.html" // Added CNBC for Market/Jobs focus
];

async function fetchAndAnalyzeNews() {
    let newArticlesCount = 0;
    let latestNewsItem = null;
    
    console.log("📡 Deep Scanning Market & Job News...");

    for (const feedUrl of TECH_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            
            // Check the top 5 articles from EACH feed (total potential ~25 items per run)
            const articlesToCheck = feed.items.slice(0, 5);

            for (const article of articlesToCheck) {
                // 1. Check for duplicates
                const existingCheck = await pool.query("SELECT id FROM news_feed WHERE title = $1", [article.title]);
                if (existingCheck.rows.length > 0) continue;

                // 2. Filter & Categorize (Focus on Jobs/Market)
                const title = article.title;
                const titleLower = title.toLowerCase();
                let category = "Tech";

                // Priority Categories
                if (titleLower.includes("hiring") || titleLower.includes("jobs") || titleLower.includes("salary") || titleLower.includes("recruit")) {
                    category = "Recruitment";
                } else if (titleLower.includes("layoff") || titleLower.includes("fired") || titleLower.includes("cut")) {
                    category = "Layoffs";
                } else if (titleLower.includes("stock") || titleLower.includes("market") || titleLower.includes("funding") || titleLower.includes("ipo")) {
                    category = "Market";
                } else if (titleLower.includes("ai") || titleLower.includes("gpt") || titleLower.includes("nvidia")) {
                    category = "AI Trend";
                }

                // 3. Clean Summary
                const summary = article.contentSnippet?.substring(0, 150) + "..." || "Click to read full story.";

                // 4. Insert into DB
                const dbResult = await pool.query(
                    `INSERT INTO news_feed (title, category, summary, sentiment) 
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [title, category, summary, "Neutral"]
                );

                console.log(`✅ Saved: [${category}] ${title.substring(0, 30)}...`);
                newArticlesCount++;
                latestNewsItem = { ...dbResult.rows[0], isNew: true };
            }

        } catch (error) {
            console.warn(`⚠️ Feed Error (${feedUrl}): ${error.message}`);
        }
    }

    console.log(`🔄 Cycle Complete. Added ${newArticlesCount} new articles.`);
    return latestNewsItem; // Returns the most recent one for the live socket update
}

module.exports = { fetchAndAnalyzeNews };