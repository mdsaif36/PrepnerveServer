const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db');

// Services
const { fetchAndAnalyzeNews } = require('./services/newsAgent');
const { generateMarketUpdate } = require('./services/marketSimulator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- ALLOWED ORIGINS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',          // Standard Vite port
    'http://localhost:3000',          // Standard React port
    'http://localhost:8081',          // ✅ ADDED: Your current frontend port
    'https://prepnerve.vercel.app',   // Production Vercel URL
    'https://prepnerve-client.onrender.com', // Production Backend URL
    process.env.FRONTEND_URL          // From .env
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // 1. Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        // 2. Check if specific origin is whitelisted
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // 3. Allow ALL Vercel Preview URLs dynamically
        const vercelPreviewRegex = /^https:\/\/prepnerve-.*-prepnerves-projects\.vercel\.app$/;
        if (vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }

        // 4. Block everything else
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
    cors: corsOptions
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
app.get('/api/market', (req, res) => {
    res.json(generateMarketUpdate());
});

// --- REAL-TIME AGENTS ---
const runNewsAgent = async () => {
    try {
        console.log("🔄 Fetching daily news updates...");
        // Ensure you have updated services/newsAgent.js to use RSS as discussed!
        const freshNews = await fetchAndAnalyzeNews(); 
        if (freshNews && io) {
            io.emit('news_update', freshNews);
        }
    } catch (error) {
        console.error("⚠️ News Agent Error:", error.message);
    }
};

// 1. Run shortly after server start
setTimeout(runNewsAgent, 5000); 

// 2. Run every 24 hours
setInterval(runNewsAgent, 86400000); 

console.log("📈 Market Simulator: ONLINE");
setInterval(() => {
    const marketData = generateMarketUpdate();
    if (io) io.emit('market_pulse', marketData);
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