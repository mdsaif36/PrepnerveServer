const Parser = require('rss-parser');
const pool = require('../db'); 

const parser = new Parser();

const TECH_FEEDS = [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://wired.com/feed/rss",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.cnbc.com/id/19854910/device/rss/rss.html",
    "https://www.zdnet.com/news/rss.xml" // Added extra feed to ensure we reach the 10-15 target
];

async function fetchAndAnalyzeNews() {
    let newArticlesCount = 0;
    let latestNewsItem = null;
    const TARGET_COUNT = 15; // Set target to 15
    
    console.log(`📡 Deep Scanning: Goal is ${TARGET_COUNT} job articles...`);

    for (const feedUrl of TECH_FEEDS) {
        // Stop if we have already reached our target for this update cycle
        if (newArticlesCount >= TARGET_COUNT) break;

        try {
            const feed = await parser.parseURL(feedUrl);
            
            // Scan deeper into each feed (top 20) to find enough job-related items
            const articlesToCheck = feed.items.slice(0, 20);

            for (const article of articlesToCheck) {
                if (newArticlesCount >= TARGET_COUNT) break;

                const title = article.title;
                const titleLower = title.toLowerCase();
                const contentLower = (article.contentSnippet || "").toLowerCase();

                // 1. STRICT JOB FILTER
                const jobKeywords = [
                    "hiring", "jobs", "salary", "recruit", "layoff", 
                    "fired", "workforce", "employment", "career", "compensation",
                    "positions", "staffing", "openings", "talent"
                ];

                const isJobRelated = jobKeywords.some(keyword => 
                    titleLower.includes(keyword) || contentLower.includes(keyword)
                );

                if (!isJobRelated) continue; 

                // 2. DUPLICATE CHECK
                const existingCheck = await pool.query("SELECT id FROM news_feed WHERE title = $1", [title]);
                if (existingCheck.rows.length > 0) continue;

                // 3. CATEGORIZATION
                let category = "Jobs";
                if (titleLower.includes("layoff") || titleLower.includes("fired") || titleLower.includes("cut")) {
                    category = "Layoffs";
                } else if (titleLower.includes("hiring") || titleLower.includes("recruit") || titleLower.includes("openings")) {
                    category = "Recruitment";
                }

                // 4. INSERT INTO DATABASE
                const dbResult = await pool.query(
                    `INSERT INTO news_feed (title, category, summary, sentiment) 
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [
                        title, 
                        category, 
                        article.contentSnippet?.substring(0, 160) + "..." || "Job market update.", 
                        "Neutral"
                    ]
                );

                console.log(`✅ [${newArticlesCount + 1}/${TARGET_COUNT}] Saved: ${title.substring(0, 40)}...`);
                newArticlesCount++;
                latestNewsItem = { ...dbResult.rows[0], isNew: true };
            }

        } catch (error) {
            console.warn(`⚠️ Feed Error (${feedUrl}): ${error.message}`);
        }
    }

    console.log(`🔄 Cycle Complete. Total Job Articles added: ${newArticlesCount}`);
    return latestNewsItem;
}

module.exports = { fetchAndAnalyzeNews };
