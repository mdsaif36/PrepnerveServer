const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { sendEmail } = require('../services/emailService'); // ✅ Import Service

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: "User already exists" });

    // Hash Password & Insert
    const hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
      [email, hash, fullName]
    );

    // ✅ SEND WELCOME EMAIL
    const emailContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #06b6d4;">Welcome to PrepNerve, ${fullName}!</h1>
        <p>Thank you for joining the elite interview simulation platform.</p>
        <p>Your account has been successfully created.</p>
        <br/>
        <p><strong>Ready to start?</strong> Log in to access your Hub.</p>
        <p><i>The PrepNerve Team</i></p>
      </div>
    `;
    
    // Send async (don't wait for it to block response)
    sendEmail(email, "Welcome to PrepNerve! 🚀", emailContent);

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (user.rows.length === 0) return res.status(400).json({ error: "Invalid Credentials" });

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) return res.status(400).json({ error: "Invalid Credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, full_name: user.rows[0].full_name } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;