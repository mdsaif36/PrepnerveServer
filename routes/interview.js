const express = require('express');
const router = express.Router();
const pool = require('../db');
const Groq = require("groq-sdk");
const { getResumeBasedQuestion, getCodingChallenge } = require('../services/questionBank');
require('dotenv').config();

// Initialize Groq (The Fast, Free AI Engine)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: Fetch conversation history to give AI context
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
        const result = await pool.query(
            `INSERT INTO interviews (user_email, topic, score, created_at) 
             VALUES ($1, $2, 0, NOW()) RETURNING id`,
            [email, topic || "General"]
        );
        const sessionId = result.rows[0].id;

        // 1. Try AI Intro using Groq
        try {
            const systemMessage = {
                role: "system",
                content: `
                You are a Senior Interviewer for a ${topic} position.
                Resume Summary: ${JSON.stringify(resumeData || {}).substring(0, 1000)}
                
                GOAL: Start the interview.
                1. Briefly welcome the candidate.
                2. Ask a customized opening question based on their resume projects or summary.
                3. Keep it spoken-style (short and professional).

                OUTPUT FORMAT: JSON only.
                { "question": "string", "mode": "verbal" }
                `
            };

            const completion = await groq.chat.completions.create({
                messages: [systemMessage],
                model: "llama3-70b-8192", // High intelligence model
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);
            
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                [sessionId, aiResponse.question]
            );

            res.json({ sessionId, ...aiResponse });

        } catch (e) {
            console.warn("⚠️ Groq API Init Failed. Using Local Engine.");
            const fallbackQ = getResumeBasedQuestion(resumeData);
            
            // Log fallback
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                [sessionId, fallbackQ]
            );
            
            res.json({ sessionId, question: fallbackQ, mode: 'verbal' });
        }

    } catch (error) {
        console.error("Start Error:", error);
        res.status(500).json({ error: "Failed to start interview" });
    }
});

// --- ROUTE: CHAT TURN (Time & Role Aware) ---
router.post('/chat', async (req, res) => {
    const { sessionId, userAnswer, resumeData, timeLeft, totalDuration } = req.body;

    try {
        // 1. Log User Answer
        await pool.query(
            `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'user', $2, NOW())`,
            [sessionId, userAnswer]
        );

        // 2. Determine Interview Stage (Time Awareness)
        const timeRatio = (timeLeft && totalDuration) ? (timeLeft / totalDuration) : 0.5;
        let stage = "MIDDLE";
        let timeInstruction = "Drill down into core skills. Challenge their assumptions.";
        
        if (timeRatio > 0.85) {
            stage = "START";
            timeInstruction = "Introductory phase. Keep questions high-level and background-focused.";
        } else if (timeRatio < 0.15) {
            stage = "END";
            timeInstruction = "Wrap up the interview. Ask if they have final thoughts or questions.";
        }

        // 3. Determine Role Type (Role Awareness)
        const roleLower = (resumeData.role || topic || "").toLowerCase();
        const isTech = roleLower.includes("dev") || roleLower.includes("engineer") || roleLower.includes("data") || roleLower.includes("stack");
        
        const roleInstruction = isTech 
            ? "TECHNICAL ROLE. You can ask about specific Code implementation, Architecture, or System Design. You MAY set 'mode':'coding' to test actual code if the conversation warrants it."
            : "NON-TECHNICAL ROLE. Ask about Situational (STAR method), Behavioral scenarios, and Strategy. Do NOT ask for code.";

        // 4. Try AI Response with Groq
        try {
            const history = await getSessionHistory(sessionId);
            
            const systemMessage = {
                role: "system",
                content: `
                You are a Senior Interviewer. 
                Role: ${resumeData.role || "Candidate"}
                Current Stage: ${stage} (${Math.floor(timeRatio * 100)}% time remaining).

                INSTRUCTIONS:
                1. ${roleInstruction}
                2. ${timeInstruction}
                3. Analyze the candidate's last answer: "${userAnswer}".
                4. If the answer was vague, ask a follow-up. If good, move to the next logical topic.
                5. Keep response CONVERSATIONAL (short, clear sentences).

                OUTPUT FORMAT: JSON ONLY.
                {
                    "feedback": "Brief reaction to their answer (e.g. 'That makes sense.')",
                    "question": "The next question to ask",
                    "mode": "verbal" or "coding",
                    "starterCode": "code string or null"
                }
                `
            };

            const completion = await groq.chat.completions.create({
                messages: [systemMessage, ...history],
                model: "llama3-70b-8192",
                temperature: 0.6,
                response_format: { type: "json_object" }
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);

            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, feedback, created_at) VALUES ($1, 'ai', $2, $3, NOW())`,
                [sessionId, aiResponse.question, aiResponse.feedback]
            );

            res.json(aiResponse);

        } catch (e) {
            // 5. Fallback Logic (Local Smart Engine)
            console.warn("⚠️ Groq API Failed/Rate Limited. Using Fallback.");
            
            // Randomly trigger coding challenge if Tech role & Middle stage
            if (isTech && stage === "MIDDLE" && Math.random() > 0.6) {
                const challenge = getCodingChallenge(resumeData.role);
                
                await pool.query(
                    `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                    [sessionId, challenge.question]
                );

                return res.json({ 
                    feedback: "Good answer. Let's verify your practical skills now.",
                    ...challenge
                });
            }
            
            // Standard verbal fallback
            const fallbackQ = getResumeBasedQuestion(resumeData);
            
            await pool.query(
                `INSERT INTO interview_logs (interview_id, role, content, created_at) VALUES ($1, 'ai', $2, NOW())`,
                [sessionId, fallbackQ]
            );

            res.json({ 
                feedback: "Thanks for sharing that.",
                question: fallbackQ,
                mode: "verbal"
            });
        }

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Processing failed" });
    }
});

// --- ROUTE: END SESSION ---
router.post('/end', async (req, res) => {
    const { sessionId } = req.body;
    
    // Simple mock score for now, or ask Groq to grade the history if you have tokens left
    const finalScore = Math.floor(Math.random() * 20) + 75; 

    await pool.query(
        `UPDATE interviews SET score = $1, status = 'completed' WHERE id = $2`,
        [finalScore, sessionId]
    );
    
    if (req.io) req.io.emit('leaderboard_update', { sessionId, finalScore });

    res.json({ final_score: finalScore });
});

module.exports = router;