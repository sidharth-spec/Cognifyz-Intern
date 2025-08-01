const Queue = require("bull");
const worker = require("./worker");
const redisConfig = require("../config/redis");

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

emailQueue.process(worker.processJob);

emailQueue.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

module.exports = emailQueue;
