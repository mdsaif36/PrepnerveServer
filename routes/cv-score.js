const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse'); 
const Groq = require("groq-sdk");
const pool = require('../db'); 
require('dotenv').config();

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- AI ANALYSIS LOGIC (Groq Version) ---
const analyzeWithGroq = async (resumeText) => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing in .env");

    const prompt = `
    You are a generic Technical Recruiter. Analyze this resume text below.
    
    RESUME TEXT:
    "${resumeText.substring(0, 6000)}" 
    
    INSTRUCTIONS:
    Return strictly valid JSON (no markdown, no explanations) with this structure:
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

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            // ✅ FIXED: Updated to the latest supported model
            model: "llama-3.3-70b-versatile", 
            temperature: 0.2,
            response_format: { type: "json_object" } 
        });

        const responseContent = completion.choices[0].message.content;
        return JSON.parse(responseContent);

    } catch (error) {
        console.error("Groq Analysis Failed:", error);
        throw error;
    }
};

// --- ROUTE ---
router.post('/analyze', async (req, res) => {
    let filePath = null;
    try {
        // Handle file upload
        const file = req.files ? req.files[0] : req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        
        filePath = file.path; 
        console.log(`📂 Processing: ${file.originalname}`);

        const userEmail = req.body.email || "demo@example.com";

        // 1. EXTRACT TEXT FROM PDF
        const dataBuffer = fs.readFileSync(filePath);
        let resumeText = "";

        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdf(dataBuffer);
            resumeText = pdfData.text;
        } else {
            // Fallback for simple text files
            resumeText = dataBuffer.toString('utf8');
        }

        if (!resumeText || resumeText.length < 50) {
            throw new Error("Could not extract text from this file. Ensure it is a text-based PDF.");
        }

        // 2. RUN GROQ ANALYSIS
        console.log("🤖 Sending extracted text to Groq...");
        const result = await analyzeWithGroq(resumeText);
        console.log(`✅ Scored: ${result.score}/100`);

        // 3. SAVE TO DATABASE
        try {
            await pool.query(
                `INSERT INTO cv_scores (user_email, score, feedback) VALUES ($1, $2, $3)`,
                [userEmail, result.score, JSON.stringify(result.analysis)]
            );
            console.log("💾 Saved to Database!");
        } catch (dbError) {
            console.error("⚠️ Database Save Failed:", dbError.message);
        }

        // Cleanup
        try { fs.unlinkSync(filePath); } catch (e) {}
        
        res.json({ success: true, ...result });

    } catch (error) {
        console.error("Server Error:", error);
        if (filePath) try { fs.unlinkSync(filePath); } catch (e) {}
        
        res.status(500).json({ 
            error: "Analysis failed", 
            details: error.message 
        });
    }
});

module.exports = router;
