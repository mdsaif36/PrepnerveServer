const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODELS_TO_TRY = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-pro"];

async function analyzeWithFallback(prompt) {
    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            if (error.message.includes("404") || error.message.includes("429")) {
                console.warn(`⚠️ Resume Parser: ${modelName} failed. Trying next...`);
                continue;
            }
            throw error;
        }
    }
    throw new Error("Resume AI Analysis failed on all models.");
}

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

        console.log(`📄 Processing Resume: ${req.file.originalname}`);

        let rawText = "";
        try {
            const pdfData = await pdfParse(req.file.buffer);
            rawText = pdfData.text.trim();
        } catch (parseErr) {
            console.error("❌ PDF Parsing Crashed:", parseErr);
        }

        if (!rawText || rawText.length < 10) {
             console.warn("⚠️ Text Empty. Using filename fallback.");
             rawText = "Resume filename: " + req.file.originalname;
        }

        console.log(`📝 Extracted ${rawText.length} characters.`);

        let parsedData = null;
        try {
            const prompt = `
            Extract resume details. Return JSON ONLY.
            RESUME TEXT: "${rawText.substring(0, 4000)}"
            JSON FORMAT: { "fullName", "summary", "skills": [], "topics": ["React", "Node"] }
            `;

            const responseText = await analyzeWithFallback(prompt);
            parsedData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
            console.log("✅ AI Analysis Successful");
        } catch (aiError) {
            console.error("⚠️ AI Analysis Failed:", aiError.message);
            parsedData = {
                fullName: "Candidate",
                summary: "Proceeding with raw file context.",
                skills: ["General Technical Skills"],
                topics: ["Full Stack Developer"]
            };
        }

        res.json({ success: true, data: parsedData, filename: req.file.originalname });

    } catch (error) {
        console.error("🔥 Critical Server Error:", error);
        res.status(500).json({ success: false, error: "Server processing failed." });
    }
});

module.exports = router;