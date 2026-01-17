const express = require('express');
const router = express.Router();
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const pool = require('../db'); // ✅ Import DB Connection
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- HELPER: Convert File to Gemini Format ---
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(filePath).toString("base64"),
            mimeType
        },
    };
}

// --- AI ANALYSIS LOGIC ---
const analyzeWithAI = async (filePath, mimeType) => {
    if (!process.env.GEMINI_API_KEY) throw new Error("No API Key found in .env");

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash-latest"];
    const filePart = fileToGenerativePart(filePath, mimeType);
    
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🤖 Analyzing with model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `
            You are a Technical Recruiter. Analyze this resume .
            Return STRICT JSON:
            {
              "score": number (0-100),
              "selectionChance": number (0-100),
              "analysis": [
                 { "category": "Critical Fixes", "items": [{ "type": "critical", "msg": "string" }] },
                 { "category": "What To Remove", "items": [{ "type": "remove", "msg": "string" }] },
                 { "category": "Tech Stack Analysis", "items": [{ "type": "warning"|"success", "msg": "string" }] }
              ]
            }
            `;

            const result = await model.generateContent([prompt, filePart]);
            const response = await result.response;
            let cleanJson = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(cleanJson);
        } catch (error) {
            console.warn(`⚠️ Model ${modelName} failed, trying next...`);
            lastError = error;
        }
    }
    throw lastError;
};

// --- ROUTE ---
router.post('/analyze', async (req, res) => {
    let filePath = null;
    try {
        // ✅ CRITICAL FIX: Handle both single file and array (upload.any)
        const file = req.files ? req.files[0] : req.file;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        
        filePath = file.path; // Store for cleanup
        console.log(`📂 Processing: ${file.originalname}`);

        // 1. Get User Email
        const userEmail = req.body.email || "demo@example.com";

        // 2. Run AI Analysis
        const result = await analyzeWithAI(filePath, file.mimetype);
        console.log(`✅ Scored: ${result.score}/100`);

        // 3. ✅ SAVE TO DATABASE
        try {
            await pool.query(
                `INSERT INTO cv_scores (user_email, score, feedback) VALUES ($1, $2, $3)`,
                [userEmail, result.score, JSON.stringify(result.analysis)]
            );
            console.log("💾 Saved to Database!");
        } catch (dbError) {
            console.error("⚠️ Database Save Failed:", dbError.message);
        }

        // 4. Cleanup & Respond
        try { fs.unlinkSync(filePath); } catch (e) {}
        res.json({ success: true, ...result });

    } catch (error) {
        console.error("Server Error:", error);
        if (filePath) try { fs.unlinkSync(filePath); } catch (e) {}
        
        res.status(500).json({ 
            error: "Processing failed", 
            details: error.message 
        });
    }
});

module.exports = router;