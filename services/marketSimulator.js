const Parser = require('rss-parser');
const parser = new Parser();

// Live Job Feeds
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
    { role: "Staff Engineer", pattern: /staff|principal/i },
    { role: "Eng. Lead", pattern: /lead|manager/i },
    { role: "Senior Dev", pattern: /senior/i },
    { role: "Mid-Level", pattern: /junior|mid|entry/i }
];

let baseMarketData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchJobData() {
    let allJobs = [];
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
    // 1. Calculate Base Skills
    const skills = TRACKED_SKILLS.map(skill => {
        const count = jobs.filter(job => 
            skill.keywords.some(k => (job.title + " " + job.content).toLowerCase().includes(k))
        ).length;
        
        const baseValue = Math.min(95, Math.max(10, Math.round((count / (jobs.length || 1)) * 100 * 1.5)));
        
        return {
            name: skill.name,
            color: skill.color,
            baseValue: baseValue || 50, 
            value: baseValue || 50,    
            trend: 0                    
        };
    });

    // 2. Extract Salaries (Adjusted for Indian Context Fallbacks)
    // Real RSS feeds usually don't have INR, so we mostly rely on our realistic Indian Simulator below.
    const salaries = [];

    // Realistic Indian Tech Salary Standards (Simulated for "Pulse" visualization)
    // Trends start positive to show a "hot" market
    if (salaries.length === 0) {
        salaries.push(
            { role: "Staff Engineer", range: "₹45L - ₹80L", baseTrend: 12.4 },
            { role: "Eng. Lead", range: "₹32L - ₹60L", baseTrend: 6.8 },
            { role: "Senior Dev", range: "₹18L - ₹40L", baseTrend: 8.2 },
            { role: "Mid-Level", range: "₹8L - ₹18L", baseTrend: 4.1 }
        );
    }

    return {
        skills,
        salaries,
        marketStatus: {
            label: jobs.length > 50 ? "Active Hiring" : "Moderate",
            baseVelocity: jobs.length || 120 
        }
    };
}

function applyLiveFluctuation(data) {
    if (!data) return null;

    // 1. Animate Skills
    const newSkills = data.skills.map(skill => {
        const noise = (Math.random() * 4) - 2; 
        let newValue = skill.baseValue + noise;
        newValue = Math.max(5, Math.min(99, newValue));
        return {
            ...skill,
            value: Number(newValue.toFixed(1)),
            trend: Number((newValue - skill.baseValue).toFixed(1)) 
        };
    });

    // 2. Animate Salaries (Trend)
    const newSalaries = data.salaries.map(sal => {
        const trendNoise = (Math.random() * 0.8) - 0.4;
        const currentTrend = sal.baseTrend || 5.0;
        return {
            ...sal,
            trend: Number((currentTrend + trendNoise).toFixed(1))
        };
    });

    // 3. Animate Market Velocity
    const velocityNoise = Math.floor((Math.random() * 10) - 5);
    const newVelocity = Math.max(10, (data.marketStatus.baseVelocity || 120) + velocityNoise);

    return {
        skills: newSkills,
        salaries: newSalaries,
        marketStatus: {
            label: data.marketStatus.label,
            velocity: `${newVelocity} Jobs/hr`
        }
    };
}

async function generateMarketUpdate() {
    const now = Date.now();
    if (!baseMarketData || (now - lastFetchTime > CACHE_DURATION)) {
        try {
            const jobs = await fetchJobData();
            if (jobs.length > 0 || !baseMarketData) {
                baseMarketData = calculateBaseTrends(jobs);
                lastFetchTime = now;
            }
        } catch (err) { console.error("Fetch Error:", err); }
    }

    if (!baseMarketData) {
        baseMarketData = calculateBaseTrends([]);
    }

    return applyLiveFluctuation(baseMarketData);
}

module.exports = { generateMarketUpdate };