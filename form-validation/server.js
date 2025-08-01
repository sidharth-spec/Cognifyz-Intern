const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");
const app = express();
const port = 3000;

// Temporary server-side storage
let formSubmissions = [];

// Configure EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to display the form
app.get("/", (req, res) => {
  res.render("index", { message: null });
});

// Server-side validation rules
const validateForm = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("age")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be between 18 and 100"),
  body("terms")
    .exists()
    .withMessage("You must accept the terms and conditions"),
];

// Route to handle form submission
app.post("/submit", validateForm, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("index", {
      message: {
        type: "error",
        title: "Validation Error",
        text: "Please fix the following errors:",
        errors: errors.array(),
      },
    });
  }

  const { name, email, age, gender } = req.body;

  // Store the validated data
  formSubmissions.push({
    name,
    email,
    age,
    gender: gender || "not specified",
    timestamp: new Date(),
  });

  // Keep only the last 10 submissions for demo purposes
  if (formSubmissions.length > 10) {
    formSubmissions = formSubmissions.slice(-10);
  }

  res.render("index", {
    message: {
      type: "success",
      title: "Registration Successful!",
      text: `Thank you, ${name}! Your registration is complete.`,
    },
  });
});

// Route to view submissions (for demonstration)
app.get("/submissions", (req, res) => {
  res.json(formSubmissions);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
