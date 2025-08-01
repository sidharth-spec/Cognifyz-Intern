const express = require("express");
const axios = require("axios");
const rateLimit = require("../middleware/rateLimit");
const router = express.Router();

// Weather API with rate limiting
router.get("/:city", rateLimit, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json({
      city: response.data.name,
      temp: response.data.main.temp,
      weather: response.data.weather[0].main,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(500).json({ error: "Weather API error" });
  }
});

module.exports = router;
