const express = require("express");
const axios = require("axios");
const router = express.Router();

// GitHub OAuth Routes
router.get("/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
  res.redirect(url);
});

router.get("/github/callback", async (req, res) => {
  try {
    const { code } = req.query;

    // Get access token
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    // Get user data
    const { data: userData } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${data.access_token}` },
    });

    res.json({
      success: true,
      user: {
        username: userData.login,
        avatar: userData.avatar_url,
      },
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: "OAuth failed" });
  }
});

module.exports = router;
