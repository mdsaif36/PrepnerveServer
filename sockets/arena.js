const { v4: uuidv4 } = require('uuid');
const pool = require('../db');
const Groq = require("groq-sdk"); 
require('dotenv').config();

// --- CONFIG AI (Using Groq) ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Waiting Queues
let waitingQueues = {
    2: [], // 1v1
    3: [], // 1v1v1
    4: []  // 1v1v1v1
};

let activeBattles = {}; 

// --- 🆕 NEW: AI CODE RUNNER (SIMULATION) ---
async function runCodeWithAI(code, problem) {
    try {
        const prompt = `
        You are a Code Execution Engine (Compiler/Interpreter). 
        PROBLEM: "${problem.title}" - ${problem.description}
        
        USER CODE:
        ${code}

        TASK:
        1. "Compile" the code mentally. If there are syntax errors, output them immediately.
        2. If valid, run it against 3 representative test cases based on the problem description.
        3. Predict the EXACT stdout/console output the code would produce.

        RETURN JSON ONLY:
        {
            "logs": [
                "Build Status: Success/Error...",
                "Test Case 1: Input=... | Expected=... | Actual=... | [PASS/FAIL]",
                "Test Case 2: ...",
                "Test Case 3: ...",
                "Console Output: (Any print statements from code)"
            ]
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // Low temp for accuracy
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        return JSON.parse(text);
    } catch (e) {
        console.error("Run Error:", e.message);
        return { logs: ["> Error: Execution service unavailable.", `> Details: ${e.message}`] };
    }
}

// --- 🤖 AI CODE JUDGE ---
async function judgeCodeWithAI(code, problem) {
    try {
        const prompt = `
        Act as a Competitive Programming Judge.
        PROBLEM: "${problem.title}" - ${problem.description}
        USER SOLUTION: ${code}

        TASK: Analyze Correctness & Complexity.
        SCORING: 0-100 (100 = Perfect & Optimal).

        RETURN JSON ONLY: { "score": number, "feedback": "string" }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        return { score: 50, feedback: "AI Judge offline." };
    }
}

// --- 🧠 AI PROBLEM GENERATOR ---
async function generateAIProblem() {
    try {
        const prompt = `Generate a coding problem (Medium/Hard). JSON: { "title", "description", "difficulty", "starter_code", "duration_seconds": number }`;
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            response_format: { type: "json_object" }
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) { return null; }
}

async function startBattle(io, players, roomId) {
    try {
        let problem = await generateAIProblem();
        if(!problem) {
             const dbRes = await pool.query("SELECT * FROM arena_problems ORDER BY RANDOM() LIMIT 1");
             problem = dbRes.rows[0] || { id:0, title: "Fallback", description: "Write sort.", starter_code: "// code", duration_seconds: 1800 };
             if(!problem.duration_seconds) problem.duration_seconds = 1800;
        }
        
        let problemId = null;
        if(problem.id) problemId = problem.id;
        else {
             try {
                const res = await pool.query("INSERT INTO arena_problems (title, description, difficulty, starter_code) VALUES ($1,$2,$3,$4) RETURNING id", [problem.title, problem.description, problem.difficulty, problem.starter_code]);
                problemId = res.rows[0].id;
             } catch(e) {}
        }

        activeBattles[roomId] = { players, problem, startTime: Date.now(), status: 'active' };
        players.forEach(p => { 
            p.score = 0; p.status = 'coding';
            const s = io.sockets.sockets.get(p.socketId);
            if(s) s.join(roomId);
        });

        io.to(roomId).emit('match_found', { roomId, problem, players });
        
        const pEmails = players.map(p => p.email);
        pool.query("INSERT INTO battles (id, player1_email, player2_email, problem_id, status) VALUES ($1, $2, $3, $4, 'active')", [roomId, pEmails[0], pEmails[1], problemId]).catch(e => console.error(e));

    } catch (err) { console.error(err); }
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 Connected: ${socket.id}`);

        // --- 🆕 NEW: REQUEST RUN LISTENER ---
        socket.on('request_run', async ({ roomId, code, email }) => {
            const room = activeBattles[roomId];
            if (!room) return;

            // 1. Notify client that execution started
            socket.emit('run_result', { 
                success: true, 
                logs: ["> Compiling on Neural Cloud...", "> Allocating resources..."] 
            });

            console.log(`🏃 Running code for ${email}...`);

            // 2. Perform AI Simulation
            const result = await runCodeWithAI(code, room.problem);
            
            // 3. Send exact results back
            socket.emit('run_result', { 
                success: true, 
                logs: result.logs || ["> Execution finished with no output."] 
            });
        });

        socket.on('join_queue', async ({ email, name, playerCount }) => {
            const count = playerCount || 2; 
            if (!waitingQueues[count]) waitingQueues[count] = [];
            waitingQueues[count] = waitingQueues[count].filter(p => p.email !== email);
            waitingQueues[count].push({ socketId: socket.id, email, name });

            if (waitingQueues[count].length >= count) {
                const players = [];
                for (let i = 0; i < count; i++) players.push(waitingQueues[count].shift());
                const roomId = `battle-${uuidv4().substring(0, 8)}`;
                await startBattle(io, players, roomId);
            }
        });

        socket.on('create_private_room', ({ email, name, playerCount }) => {
            const count = Math.min(4, Math.max(2, playerCount || 2)); 
            let roomId, retries = 0;
            do { roomId = `PVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`; retries++; } while (activeBattles[roomId] && retries < 10);
            activeBattles[roomId] = { players: [], requiredPlayers: count, status: 'waiting', problem: null };
            socket.emit('room_created', { roomId });
        });

        socket.on('join_private_room', async ({ roomId, email, name, playerCount }) => {
            if (!activeBattles[roomId]) {
                const count = Math.min(4, Math.max(2, playerCount || 2));
                activeBattles[roomId] = { players: [], requiredPlayers: count, status: 'waiting' };
            }
            const room = activeBattles[roomId];
            if (room.players.length >= room.requiredPlayers) { socket.emit('error', { message: "Room is full!" }); return; }
            if (room.status === 'active') { socket.emit('error', { message: "Game in progress!" }); return; }

            room.players.push({ socketId: socket.id, email, name, score: 0, status: 'coding' });
            socket.join(roomId);
            io.to(roomId).emit('room_update', { players: room.players, needed: room.requiredPlayers });
            if (room.players.length === room.requiredPlayers) await startBattle(io, room.players, roomId);
        });

        socket.on('send_progress', ({ roomId, percent, status }) => {
            socket.to(roomId).emit('opponent_progress', { socketId: socket.id, percent: percent, status: status || 'coding' });
        });

        socket.on('submit_code', async ({ roomId, code, email }) => {
            const room = activeBattles[roomId];
            if (!room) return;
            const player = room.players.find(p => p.email === email);
            if (!player) return;

            const judgment = await judgeCodeWithAI(code, room.problem);
            player.score = judgment.score;
            player.feedback = judgment.feedback;
            player.status = 'submitted';

            io.to(roomId).emit('opponent_progress', { socketId: player.socketId, percent: 100, status: 'submitted' });
            socket.emit('submission_result', { success: true, message: `Code Submitted! Score: ${judgment.score}/100. Waiting for opponents...` });

            const allFinished = room.players.every(p => p.status === 'submitted' || p.status === 'disqualified');
            if (allFinished) {
                const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
                const winner = sortedPlayers[0];
                io.to(roomId).emit('game_over', {
                    winnerEmail: winner.email,
                    results: sortedPlayers.map(p => ({ name: p.name, email: p.email, score: p.score, feedback: p.feedback, status: p.status }))
                });
                pool.query("UPDATE battles SET winner_email = $1, status = 'completed' WHERE id = $2", [winner.email, roomId]).catch(e => {});
                delete activeBattles[roomId];
            }
        });

        socket.on('disconnect', () => {
            [2, 3, 4].forEach(n => waitingQueues[n] = waitingQueues[n].filter(p => p.socketId !== socket.id));
            for (const [roomId, room] of Object.entries(activeBattles)) {
                const player = room.players.find(p => p.socketId === socket.id);
                if (player) {
                    player.status = 'disqualified';
                    player.score = 0; 
                    io.to(roomId).emit('opponent_progress', { socketId: socket.id, percent: 0, status: 'disqualified' });
                    const allFinished = room.players.every(p => p.status === 'submitted' || p.status === 'disqualified');
                    if (allFinished && room.status === 'active') {
                        const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
                        const winner = sortedPlayers[0];
                        io.to(roomId).emit('game_over', {
                            winnerEmail: winner.email,
                            results: sortedPlayers.map(p => ({ name: p.name, email: p.email, score: p.score, feedback: p.feedback, status: p.status }))
                        });
                        delete activeBattles[roomId];
                    }
                }
            }
        });
    });
};
