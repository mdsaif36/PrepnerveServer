// ✅ 1. Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// ✅ 2. Database import
const pool = require('./db');

// Services
const { fetchAndAnalyzeNews } = require('./services/newsAgent');
const { generateMarketUpdate } = require('./services/marketSimulator');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CRITICAL FOR RENDER DEPLOYMENT (Fixes Google Auth Redirects)
app.set('trust proxy', 1); 

// --- ALLOWED ORIGINS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',          // Standard Vite port
    'http://localhost:3000',          // Standard React port
    'http://localhost:8081',          // Your current frontend port
    'https://prepnerve.vercel.app',   // Production Vercel URL
    process.env.FRONTEND_URL          // From .env
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        // Allow Vercel preview deployments
        const vercelPreviewRegex = /^https:\/\/prepnerve-.*-prepnerves-projects\.vercel\.app$/;
        if (vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }
        console.error(`🔥 CORS Blocked: ${origin}`);
        return callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

// --- SERVER SETUP ---
const server = http.createServer(app);

// Apply CORS to Socket.io
const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling'] // ✅ Added for Render Stability
});

// Apply CORS to Express
app.use(cors(corsOptions));
app.use(express.json());

// Inject Socket.io into Request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- DISK STORAGE ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadDisk = multer({ storage: storage });

// --- ROUTES ---
const authRoutes = require('./routes/auth');
const cvScoreRoutes = require('./routes/cv-score');
const interviewRoutes = require('./routes/interview');
const resumeRoutes = require('./routes/resume');
const dashboardRoutes = require('./routes/dashboard');
const leaderboardRoutes = require('./routes/leaderboard');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/cv-score', uploadDisk.any(), cvScoreRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// --- NEWS API ---
app.get('/api/news', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM news_feed ORDER BY created_at DESC LIMIT 20');
        if (result.rows.length > 0) {
            const formattedNews = result.rows.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                summary: item.summary
            }));
            return res.json(formattedNews);
        }
    } catch (err) {
        console.warn("DB unavailable, serving fallback news.");
    }
    // Fallback if DB is empty
    res.json([
        { id: 101, title: "Market Data Loading...", category: "System", time: "Just now" }
    ]);
});

// --- MARKET API ---
app.get('/api/market', async (req, res) => {
    const data = await generateMarketUpdate();
    res.json(data);
});

// --- REAL-TIME AGENTS ---
const runNewsAgent = async () => {
    try {
        console.log("🔄 News Agent: Scanning for updates...");
        
        // Fetch new articles
        const newsData = await fetchAndAnalyzeNews(); 
        
        if (!newsData) return;

        if (io) {
            if (Array.isArray(newsData) && newsData.length > 0) {
                console.log(`📡 Broadcasting ${newsData.length} new articles...`);
                newsData.forEach((article, index) => {
                    setTimeout(() => {
                        io.emit('news_update', article);
                    }, index * 2000); 
                });
            } else if (!Array.isArray(newsData)) {
                io.emit('news_update', newsData);
            }
        }
    } catch (error) {
        console.error("⚠️ News Agent Error:", error.message);
    }
};

// 1. Run shortly after server start
setTimeout(runNewsAgent, 5000); 

// 2. Run every 10 MINUTES
setInterval(runNewsAgent, 600000); 

console.log("📈 Market Simulator: ONLINE");

// 3. Market Pulse - Runs every 3 seconds
setInterval(async () => {
    try {
        const marketData = await generateMarketUpdate();
        if (io) io.emit('market_pulse', marketData);
    } catch (err) {
        console.error("Market Pulse Error:", err);
    }
}, 3000);

const arenaSocketHandler = require('./sockets/arena');
arenaSocketHandler(io);

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

// --- START SERVER ---
server.listen(PORT, () => {
    console.log(`\n✅ PrepNerve Core running on http://localhost:${PORT}`);
    console.log(`⚔️  Battle Arena, News & Market: Online`);
    console.log(`🌍 Dynamic CORS enabled`);
});
