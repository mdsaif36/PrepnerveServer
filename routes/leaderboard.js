const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    // Aggregates scores by email, calculates average, and sorts descending
    const query = `
      SELECT 
        user_email, 
        ROUND(AVG(score)) as avg_score, 
        COUNT(*) as sessions_played 
      FROM interviews 
      WHERE score IS NOT NULL 
      GROUP BY user_email 
      ORDER BY avg_score DESC, sessions_played DESC 
      LIMIT 50
    `;

    const result = await pool.query(query);

    // Format data for frontend (Hide full email, generate a "Name")
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      name: row.user_email.split('@')[0], // Extract "john" from "john@gmail.com"
      score: parseInt(row.avg_score),
      sessions: parseInt(row.sessions_played)
    }));

    res.json(leaderboard);

  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;