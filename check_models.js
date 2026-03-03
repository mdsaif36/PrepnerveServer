const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("🔍 Checking available models...");

axios.get(url)
  .then(res => {
    console.log("\n✅ AVAILABLE MODELS:");
    res.data.models.forEach(m => console.log(` - ${m.name.replace('models/', '')}`));
  })
  .catch(err => {
    console.error("❌ Error:", err.response ? err.response.data : err.message);
  });