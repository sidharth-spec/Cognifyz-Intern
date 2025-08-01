const app = require("./app");
const redis = require("./config/redis");
const PORT = process.env.PORT || 3000;

// Test Redis connection before starting
redis
  .ping()
  .then(() => {
    console.log("✅ Redis is ready");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Redis connection failed:", err);
    process.exit(1);
  });
