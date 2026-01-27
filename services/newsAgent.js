const Parser = require('rss-parser');
const pool = require('../db'); 

const parser = new Parser();

const TECH_FEEDS = [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://wired.com/feed/rss",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.cnbc.com/id/19854910/device/rss/rss.html"
];

async function fetchAndAnalyzeNews() {
    let newArticlesCount = 0;
    let latestNewsItem = null;
    
    console.log("📡 Deep Scanning for Job & Career News Only...");

    for (const feedUrl of TECH_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            const articlesToCheck = feed.items.slice(0, 10); // Increased slice to find more matches

            for (const article of articlesToCheck) {
                const title = article.title;
                const titleLower = title.toLowerCase();
                const contentLower = (article.contentSnippet || "").toLowerCase();
                
                // 1. STRENGHTENED JOB FILTER
                // We only proceed if the title or content contains job-related keywords
                const jobKeywords = ["hiring", "jobs", "salary", "recruit", "layoff", "fired", "career", "employment", "workforce", "compensation"];
                const isJobRelated = jobKeywords.some(keyword => 
                    titleLower.includes(keyword) || contentLower.includes(keyword)
                );

                if (!isJobRelated) continue; // Skip if not related to jobs

                // 2. Check for duplicates
                const existingCheck = await pool.query("SELECT id FROM news_feed WHERE title = $1", [title]);
                if (existingCheck.rows.length > 0) continue;

                // 3. Categorize
                let category = "Jobs";
                if (titleLower.includes("layoff") || titleLower.includes("fired") || titleLower.includes("cut")) {
                    category = "Layoffs";
                } else if (titleLower.includes("hiring") || titleLower.includes("recruit")) {
                    category = "Recruitment";
                } else if (titleLower.includes("salary") || titleLower.includes("compensation")) {
                    category = "Salary Trends";
                }

                // 4. Clean Summary
                const summary = article.contentSnippet?.substring(0, 150) + "..." || "Click to read full story.";

                // 5. Insert into DB
                const dbResult = await pool.query(
                    `INSERT INTO news_feed (title, category, summary, sentiment) 
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [title, category, summary, "Neutral"]
                );

                console.log(`✅ Job Item Saved: [${category}] ${title.substring(0, 30)}...`);
                newArticlesCount++;
                latestNewsItem = { ...dbResult.rows[0], isNew: true };
            }

        } catch (error) {
            console.warn(`⚠️ Feed Error (${feedUrl}): ${error.message}`);
        }
    }

    console.log(`🔄 Cycle Complete. Added ${newArticlesCount} job-specific articles.`);
    return latestNewsItem;
}

module.exports = { fetchAndAnalyzeNews };
