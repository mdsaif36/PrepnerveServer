const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ UPDATED: Using a model from your available list
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const TOPICS = [
    "React.js", "Node.js", "Python", "System Design", 
    "SQL", "Machine Learning", "DevOps", "Behavioral"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

async function generateAndSeed() {
    console.log("🚀 Starting Synthetic Dataset Generation...");

    for (const topic of TOPICS) {
        for (const diff of DIFFICULTIES) {
            console.log(`\n🤖 Generating ${diff} questions for ${topic}...`);
            
            const prompt = `
            Generate 5 unique, high-quality technical interview questions for "${topic}" at "${diff}" level.
            
            OUTPUT STRICT JSON ARRAY:
            [
              { 
                "text": "Question text here", 
                "type": "verbal", 
                "starter_code": null
              }
            ]
            `;

            try {
                const result = await chatModel.generateContent(prompt);
                const response = await result.response;
                const responseText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                
                let questions = [];
                try {
                    questions = JSON.parse(responseText);
                } catch (parseErr) {
                    console.error("JSON Parse Error (skipping batch):", parseErr.message);
                    continue; 
                }

                for (const q of questions) {
                    const embedRes = await embedModel.embedContent(q.text);
                    const vector = `[${embedRes.embedding.values.join(',')}]`;

                    await pool.query(
                        `INSERT INTO question_bank (category, difficulty, type, question_text, starter_code, embedding) 
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [topic, diff, q.type || 'verbal', q.text, q.starter_code || null, vector]
                    );
                    
                    process.stdout.write("."); 
                }

            } catch (e) {
                console.error(`\n❌ Error generating for ${topic}:`, e.message);
            }
            
            // Wait 2s to be safe
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    console.log("\n\n🎉 Dataset Generation Complete!");
    pool.end();
}

generateAndSeed();