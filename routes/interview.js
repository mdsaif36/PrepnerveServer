const express = require('express');
const router = express.Router();
const pool = require('../db');
const Groq = require("groq-sdk");
const { getResumeBasedQuestion, getCodingChallenge } = require('../services/questionBank');
require('dotenv').config();

// --- 1. Initialize Groq SAFELY (Directly using Groq SDK) ---
let groq = null;
if (process.env.GROQ_API_KEY) {
    try {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log("✅ Groq AI Connected");
    } catch (err) {
        console.warn("⚠️ Groq Init Failed:", err.message);
    }
} else {
    console.warn("⚠️ GROQ_API_KEY missing. Using local question bank fallback.");
}

// Helper: Fetch history from 'interview_logs' for AI context
async function getSessionHistory(sessionId) {
    const result = await pool.query(
        `SELECT role, content FROM interview_logs WHERE interview_id = $1 ORDER BY created_at ASC LIMIT 10`,
        [sessionId]
    );
    return result.rows.map(row => ({
        role: row.role === 'ai' ? 'assistant' : 'user',
        content: row.content
    }));
}

// --- ROUTE: START SESSION ---
router.post('/start', async (req, res) => {
    const { email, topic, resumeData } = req.body;
    
    try {
        // Inserts into 'public.interviews' and retrieves the unique ID
        const result = await pool.query(
            `INSERT INTO interviews (user_email, topic, score, status, created_at) 
             VALUES ($1, $2, 0, 'ongoing', NOW()) RETURNING id`,
            [email, topic || "General"]
        );
        const sessionId = result.rows[0].id;

        try {
            if (!groq) throw new Error("Groq not configured");

            const systemMessage = {
                role: "system",
                content: `You are a Senior Interviewer for a ${topic} position.
                Resume Summary: ${JSON.stringify(resumeData || {}).substring(0, 1000)}
                
                GOAL: Welcome the candidate and ask a short professional opening question.
                OUTPUT FORMAT: JSON only { "question": "string", "mode": "verbal" }`
            };

            const completion = await groq.chat.completions.create({
                messages: [systemMessage],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);
            
            // Log AI opening question to 'interview_logs' using 'interview_id'
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                [sessionId, aiResponse.question]
            );

            res.json({ sessionId, ...aiResponse });

        } catch (e) {
            console.warn("⚠️ AI Start Failed (Using Local Engine):", e.message);
            const fallbackQ = getResumeBasedQuestion(resumeData);
            
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                [sessionId, fallbackQ]
            );
            
            res.json({ sessionId, question: fallbackQ, mode: 'verbal' });
        }
    } catch (error) {
        console.error("Start Error:", error);
        res.status(500).json({ error: "Check if 'interviews' table exists in database." });
    }
});

// --- ROUTE: CHAT TURN (Groq Powered) ---
router.post('/chat', async (req, res) => {
    const { sessionId, userAnswer, resumeData, timeLeft, totalDuration } = req.body;

    try {
        // Log the user's spoken answer
        await pool.query(
            `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'user', $2, NOW())`,
            [sessionId, userAnswer]
        );

        const timeRatio = (timeLeft && totalDuration) ? (timeLeft / totalDuration) : 0.5;
        let stage = "MIDDLE";
        if (timeRatio > 0.85) stage = "START";
        else if (timeRatio < 0.15) stage = "END";

        const roleLower = (resumeData?.role || topic || "").toLowerCase();
        const isTech = roleLower.includes("dev") || roleLower.includes("engineer") || roleLower.includes("stack");

        try {
            if (!groq) throw new Error("Groq not configured");

            const history = await getSessionHistory(sessionId);
            
            const systemMessage = {
                role: "system",
                content: `You are a Senior Interviewer. Current Stage: ${stage}.
                INSTRUCTIONS:
                1. If technical, focus on architecture or code logic.
                2. Analyze answer: "${userAnswer}".
                3. Ask a natural follow-up or next topic.
                4. KEEP QUESTIONS SHORT.
                
                OUTPUT FORMAT: JSON ONLY {
                    "feedback": "Short reaction",
                    "question": "Next spoken question",
                    "mode": "verbal" or "coding",
                    "starterCode": "optional code string"
                }`
            };

            const completion = await groq.chat.completions.create({
                messages: [systemMessage, ...history],
                model: "llama-3.3-70b-versatile",
                temperature: 0.6,
                response_format: { type: "json_object" }
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);

            // Log AI response and feedback to 'interview_logs'
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, feedback, created_at) VALUES ($1, 'ai', $2, $3, NOW())`,
                [sessionId, aiResponse.question, aiResponse.feedback]
            );

            res.json(aiResponse);

        } catch (e) {
            console.warn("⚠️ Groq API Failed. Using Fallback.");
            const fallbackQ = getResumeBasedQuestion(resumeData);
            res.json({ 
                feedback: "Thanks for that explanation.",
                question: fallbackQ,
                mode: "verbal"
            });
        }
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Check if 'interview_logs' table exists in database." });
    }
});

// --- ROUTE: END SESSION ---
router.post('/end', async (req, res) => {
    const { sessionId } = req.body;
    const finalScore = Math.floor(Math.random() * 20) + 75; 

    try {
        await pool.query(
            `UPDATE interviews SET score = $1, status = 'completed' WHERE id = $2`,
            [finalScore, sessionId]
        );
        res.json({ final_score: finalScore });
    } catch (e) {
        res.status(500).json({ error: "End session database update failed." });
    }
});

module.exports = router;
