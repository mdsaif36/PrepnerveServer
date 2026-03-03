const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { sendEmail } = require('../services/emailService');

// Default to localhost if .env is missing
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 

// --- LOCAL SIGNUP ---
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
      [email, hash, fullName]
    );

    const emailContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #06b6d4;">Welcome to PrepNerve, ${fullName}!</h1>
        <p>Your account has been successfully created.</p>
        <p><strong>Ready to start?</strong> Log in to access your Hub.</p>
      </div>
    `;
    sendEmail(email, "Welcome to PrepNerve! 🚀", emailContent);

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- LOCAL LOGIN ---
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

// ==========================================
// 🚀 SOCIAL LOGIN ROUTES (FIXED)
// ==========================================

// --- 1. GOOGLE LOGIN ---
router.get('/google', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' '),
  };
  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    // A. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    
    if (tokens.error) {
        console.error("Google Token Error:", tokens);
        return res.redirect(`${FRONTEND_URL}/auth?error=google_token_failed`);
    }

    const { access_token } = tokens;

    // B. Get User Info (FIXED: Uses access_token in Authorization header)
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    const googleUser = await userRes.json();
    const { email, name } = googleUser;

    // Safety Check: If Google didn't return an email, stop here.
    if (!email) {
       console.error("Google User Error (No Email):", googleUser);
       return res.redirect(`${FRONTEND_URL}/auth?error=google_no_email`);
    }

    // C. Database Logic
    let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let isNewUser = false;
    
    if (user.rows.length === 0) {
      isNewUser = true;
      const dummyHash = await bcrypt.hash(Math.random().toString(36), 10);
      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
        [email, dummyHash, name]
      );
      user = newUser;
      
      // Optional: Send Welcome Email for Google Users too
      const emailContent = `
        <div style="font-family: Arial, sans-serif;">
          <h1>Welcome, ${name}!</h1>
          <p>You have successfully signed in with Google.</p>
        </div>
      `;
      // sendEmail(email, "Welcome to PrepNerve!", emailContent);
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
    const userData = encodeURIComponent(JSON.stringify(user.rows[0]));
    const authType = isNewUser ? 'signup' : 'login';
    
    res.redirect(`${FRONTEND_URL}/auth?token=${token}&user=${userData}&type=${authType}`);

  } catch (err) {
    console.error("Google Auth Fatal Error:", err);
    res.redirect(`${FRONTEND_URL}/auth?error=google_failed`);
  }
});

// --- 2. GITHUB LOGIN ---
router.get('/github', (req, res) => {
  const rootUrl = 'https://github.com/login/oauth/authorize';
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    scope: 'user:email',
  };
  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) {
       return res.redirect(`${FRONTEND_URL}/auth?error=github_token_failed`);
    }

    const access_token = tokenData.access_token;

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const githubUser = await userRes.json();

    let email = githubUser.email;
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const emails = await emailRes.json();
      email = (emails.find(e => e.primary) || emails[0])?.email;
    }

    if (!email) {
        console.error("No email found for GitHub user");
        return res.redirect(`${FRONTEND_URL}/auth?error=github_no_email`);
    }

    let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let isNewUser = false;
    
    if (user.rows.length === 0) {
      isNewUser = true;
      const dummyHash = await bcrypt.hash(Math.random().toString(36), 10);
      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
        [email, dummyHash, githubUser.name || githubUser.login]
      );
      user = newUser;
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
    const userData = encodeURIComponent(JSON.stringify(user.rows[0]));
    const authType = isNewUser ? 'signup' : 'login';
    
    res.redirect(`${FRONTEND_URL}/auth?token=${token}&user=${userData}&type=${authType}`);

  } catch (err) {
    console.error("GitHub Auth Error:", err);
    res.redirect(`${FRONTEND_URL}/auth?error=github_failed`);
  }
});

module.exports = router;
