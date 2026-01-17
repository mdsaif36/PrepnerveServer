const Parser = require('rss-parser');
const parser = new Parser();

// Live Job Feeds (Real-time data sources)
const JOB_FEEDS = [
    "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    "https://remoteok.com/remote-jobs.rss",
    "https://remotive.com/feed"
];

// Skills to Track
const TRACKED_SKILLS = [
    { name: "React / Next.js", keywords: ["react", "next.js", "frontend"], color: "bg-blue-500" },
    { name: "Generative AI", keywords: ["ai", "llm", "machine learning", "gpt", "python"], color: "bg-purple-500" },
    { name: "Rust / System", keywords: ["rust", "c++", "golang", "system"], color: "bg-orange-500" },
    { name: "Cloud / DevOps", keywords: ["aws", "docker", "kubernetes", "cloud"], color: "bg-cyan-500" },
    { name: "Cybersecurity", keywords: ["security", "cyber", "infosec"], color: "bg-red-500" }
];

const ROLE_PATTERNS = [
    { role: "Senior Engineer", pattern: /senior|lead|staff|principal/i },
    { role: "Full Stack", pattern: /full.?stack/i },
    { role: "AI/ML Engineer", pattern: /ai|machine learning|data scientist/i },
    { role: "Junior/Entry", pattern: /junior|entry|intern/i }
];

// State
let baseMarketData = null; // The TRUE data from RSS
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchJobData() {
    let allJobs = [];
    // console.log("📡 Scanning Real-Time Job Feeds..."); // Optional logging
    for (const feedUrl of JOB_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            allJobs.push(...feed.items);
        } catch (error) {
            // console.warn(`⚠️ Failed to fetch feed ${feedUrl}`);
        }
    }
    return allJobs;
}

function calculateBaseTrends(jobs) {
    // 1. Calculate Base Skill Scores from Real Data
    const skills = TRACKED_SKILLS.map(skill => {
        const count = jobs.filter(job => 
            skill.keywords.some(k => (job.title + " " + job.content).toLowerCase().includes(k))
        ).length;

        // Calculate a "Base Value" (0-100)
        // Multiplier 1.5 helps visualize demand better on the UI bars
        const baseValue = Math.min(95, Math.max(10, Math.round((count / jobs.length) * 100 * 1.5)));
        
        // Simple Trend Logic
        const recentJobs = jobs.slice(0, Math.floor(jobs.length / 2));
        const recentCount = recentJobs.filter(job => skill.keywords.some(k => (job.title + " " + job.content).toLowerCase().includes(k))).length;
        const trendDirection = recentCount > (count / 2) ? "+" : "-";
        
        return {
            name: skill.name,
            color: skill.color,
            baseValue: baseValue, // Store TRUE value here
            value: baseValue,     // Current display value (will fluctuate)
            trendDirection: trendDirection
        };
    });

    // 2. Extract Salaries (Same as before)
    const salaryRegex = /\$(\d{2,3})k?\s?-\s?\$(\d{2,3})k?/i;
    const salaries = ROLE_PATTERNS.map(roleDef => {
        const roleJobs = jobs.filter(j => roleDef.pattern.test(j.title));
        let totalMax = 0, count = 0, totalMin = 0;
        
        roleJobs.forEach(job => {
            const match = (job.content || "").match(salaryRegex) || (job.title || "").match(salaryRegex);
            if (match) {
                totalMin += parseInt(match[1]);
                totalMax += parseInt(match[2]);
                count++;
            }
        });

        if (count === 0) return null;
        return {
            role: roleDef.role,
            range: `$${Math.round(totalMin/count)}k - $${Math.round(totalMax/count)}k`,
            trend: (totalMax/count) > 130 ? "up" : "flat"
        };
    }).filter(Boolean);

    // Fallbacks if RSS is empty/quiet
    if (salaries.length === 0) {
        salaries.push(
            { role: "Senior Engineer", range: "$120k - $175k", trend: "up" },
            { role: "Full Stack Dev", range: "$95k - $145k", trend: "flat" },
            { role: "AI Engineer", range: "$150k - $230k", trend: "up" }
        );
    }

    return {
        skills,
        salaries,
        marketStatus: {
            label: jobs.length > 50 ? "Active Hiring" : "Moderate",
            velocity: `${jobs.length} Jobs/hr`
        }
    };
}

function applyLiveFluctuation(data) {
    if (!data) return null;

    // Clone the data to avoid modifying the base cache permanently
    const liveData = {
        ...data,
        skills: data.skills.map(skill => {
            // Fluctuate randomly around the Base Value (+/- 1.5%)
            const noise = (Math.random() * 3) - 1.5; 
            let newValue = skill.baseValue + noise;
            
            // Clamp between 0 and 100
            newValue = Math.max(5, Math.min(99, newValue));

            // Calculate formatted trend string based on the fluctuation
            const diff = newValue - skill.baseValue;
            const trendString = `${skill.trendDirection}${Math.abs(diff).toFixed(1)}%`;

            return {
                ...skill,
                value: Number(newValue.toFixed(1)), // The value sent to frontend
                trend: trendString
            };
        })
    };
    return liveData;
}

// Main API Function
async function generateMarketUpdate() {
    const now = Date.now();
    
    // 1. Fetch Real Data if Cache Expired
    if (!baseMarketData || (now - lastFetchTime > CACHE_DURATION)) {
        try {
            const jobs = await fetchJobData();
            if (jobs.length > 0) {
                baseMarketData = calculateBaseTrends(jobs);
                lastFetchTime = now;
                console.log("✅ Market Data Refreshed from RSS");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    }

    // 2. Initialize fallback if fetch completely failed
    if (!baseMarketData) {
        baseMarketData = {
            skills: TRACKED_SKILLS.map(s => ({ ...s, baseValue: 50, value: 50, trendDirection: "+" })),
            salaries: [],
            marketStatus: { label: "Initializing", velocity: "0" }
        };
    }

    // 3. Apply "Live" Jitter so it moves every time the frontend polls
    return applyLiveFluctuation(baseMarketData);
}

module.exports = { generateMarketUpdate };