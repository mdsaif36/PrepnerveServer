const express = require('express');
const router = express.Router();
const pool = require('../db');

// --- AUTO-FIX: Ensure Database Table Exists ---
const ensureTableExists = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS matches (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                player_email TEXT NOT NULL,
                opponent_email TEXT NOT NULL,
                winner_email TEXT,
                mode TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
        `);
    } catch (err) {
        console.error("⚠️ Auto-Fix Table Error:", err.message);
    }
};

// GET /api/stats/battle-profile?email=...
router.get('/battle-profile', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
        // 1. Run Auto-Fix (Creates table if missing)
        await ensureTableExists();

        // 2. Fetch all matches involving this player
        const historyQuery = `
            SELECT * FROM matches 
            WHERE player_email = $1 OR opponent_email = $1 
            ORDER BY created_at DESC 
            LIMIT 20
        `;
        const historyRes = await pool.query(historyQuery, [email]);
        const matches = historyRes.rows;

        // 3. Calculate Stats
        let wins = 0;
        let losses = 0;
        
        const formattedHistory = matches.map(m => {
            const isWin = m.winner_email === email;
            if (isWin) wins++; else losses++;

            // Determine opponent name
            const opponent = m.player_email === email ? m.opponent_email : m.player_email;

            return {
                id: m.id,
                opponent: opponent.split('@')[0], // Display name
                result: isWin ? 'VICTORY' : 'DEFEAT',
                mode: m.mode || '1v1',
                date: new Date(m.created_at).toLocaleDateString()
            };
        });

        // 4. Calculate Win Rate
        const total = wins + losses;
        const winRate = total === 0 ? 0 : Math.round((wins / total) * 100);

        // 5. Determine Tier
        let tier = "Rookie";
        if (wins >= 5) tier = "Bronze";
        if (wins >= 15) tier = "Silver";
        if (wins >= 30) tier = "Gold";
        if (wins >= 50) tier = "Diamond";

        // 6. Return Data
        res.json({
            stats: { wins, losses, total, winRate, tier },
            history: formattedHistory
        });

    } catch (err) {
        console.error("🔥 Stats Error:", err);
        res.status(500).json({ error: "Failed to load battle profile." });
    }
});

module.exports = router;