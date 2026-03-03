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
const csv = require('csv-parser'); 

// ✅ 2. Database import
const pool = require('./db');

// Services
const { fetchAndAnalyzeNews } = require('./services/newsAgent');
const { generateMarketUpdate } = require('./services/marketSimulator');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CRITICAL FOR RENDER DEPLOYMENT
app.set('trust proxy', 1); 

// --- ALLOWED ORIGINS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8081',
    'https://prepnerve.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        const vercelPreviewRegex = /^https:\/\/prepnerve-.*-prepnerves-projects\.vercel\.app$/;
        if (vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }
        console.error(`🔥 CORS Blocked: ${origin}`);
        return callback(new Error(`CORS policy blocked access from: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

// --- SERVER SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling']
});

app.use(cors(corsOptions));
app.use(express.json());

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

// ✅ UPDATED: INTELLIGENCE BANK API
app.get('/api/questions', async (req, res) => {
    const results = [];

    const readCSV = (filePath, mapRowFunction, limit = null) => {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) return resolve();
            let count = 0;
            const stream = fs.createReadStream(filePath)
                .pipe(csv({
                    mapHeaders: ({ header }) => header.trim().replace(/^[\uFEFF\xA0]+|[\uFEFF\xA0]+$/g, '')
                }));

            stream.on('data', (data) => {
                if (limit && count >= limit) { stream.destroy(); return resolve(); }
                const mappedData = mapRowFunction(data);
                if (mappedData && mappedData.text) {
                    results.push(mappedData);
                    count++;
                }
            }).on('end', resolve).on('error', reject);
        });
    };

    try {
        // 1. Original Dataset
        await readCSV(path.join(__dirname, 'data', 'full_interview_questions_dataset.csv'), (data) => ({
            text: data.question,
            role: data.role,
            type: data.category,
            difficulty: data.difficulty
        }));

        // 2. Programming Questions & Solutions
        await readCSV(path.join(__dirname, 'data', 'programming_questions_solutions.csv'), (data) => ({
            text: data.Question,
            role: data.Topic || "General Programming",
            type: data['Programming Language'] || "Technical",
            difficulty: data['Difficulty Level']
        }));

        // 3. StackOverflow Combined (Limited for performance)
        await readCSV(path.join(__dirname, 'data', 'stackoverflow_combined.csv'), (data) => ({
            text: data.title,
            role: "StackOverflow Q&A",
            type: data.programming_language || "General",
            difficulty: "Real-World"
        }), 500);

        // 4. Backend Interview Questions 1000
        await readCSV(path.join(__dirname, 'data', 'backend_interview_questions_1000.csv'), (data) => ({
            text: data.question,
            role: data.category || "Backend Development",
            type: "Backend",
            difficulty: data.difficulty
        }));

        // 5. Programming Interview Questions 1000
        await readCSV(path.join(__dirname, 'data', 'programming_interview_questions_1000.csv'), (data) => ({
            text: data.question,
            role: data.category || "Software Engineering",
            type: "Programming",
            difficulty: data.difficulty
        }));

        // 6. DSA Full Questions 1000
        await readCSV(path.join(__dirname, 'data', 'dsa_full_questions_1000.csv'), (data) => ({
            text: `${data.title}: ${data.full_question}`,
            role: data.topic || "Data Structures",
            type: "Algorithm",
            difficulty: data.difficulty,
            companies: data.companies // ✅ Passed as separate field for badges
        }));

        // 7. NEW: Algorithm Coding Dataset
        await readCSV(path.join(__dirname, 'data', 'questions_dataset.csv'), (data) => ({
            text: `${data.title}: ${data.description}`,
            role: "Coding Challenge",
            type: "Algorithm",
            difficulty: data.difficulty_level
        }));

        res.json(results);
    } catch (err) {
        console.error("Error reading datasets:", err);
        res.status(500).json({ error: "Failed to compile datasets" });
    }
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
        const newsData = await fetchAndAnalyzeNews(); 
        if (!newsData) return;

        if (io) {
            if (Array.isArray(newsData) && newsData.length > 0) {
                newsData.forEach((article, index) => {
                    setTimeout(() => { io.emit('news_update', article); }, index * 2000); 
                });
            } else if (!Array.isArray(newsData)) {
                io.emit('news_update', newsData);
            }
        }
    } catch (error) {
        console.error("⚠️ News Agent Error:", error.message);
    }
};

setTimeout(runNewsAgent, 5000); 
setInterval(runNewsAgent, 600000); 

// --- MARKET PULSE ---
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
    console.log(`⚔️  Intelligence Bank, News & Market: Online`);
});