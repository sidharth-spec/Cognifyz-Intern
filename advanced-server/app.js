const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const emailQueue = require("./queues/emailQueue");
const emailSchema = require("./schemas/emailSchema");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.post("/api/send-email", async (req, res) => {
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const job = await emailQueue.add(req.body);
  res.json({ message: "Email queued!", jobId: job.id });
});

// Error handling
app.use(errorHandler);

module.exports = app;
