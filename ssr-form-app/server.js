const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Configure EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to display the form
app.get("/", (req, res) => {
  res.render("index", { message: null });
});

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  // Process the form data (in a real app, you might save to a database)
  const responseMessage = `Thank you, ${name}! We received your message "${message}" and will contact you at ${email}.`;

  // Render the same page with a message
  res.render("index", { message: responseMessage });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
