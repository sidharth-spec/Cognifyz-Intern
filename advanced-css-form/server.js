const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");
const app = express();
const port = 3000;

// Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Temporary storage
let formSubmissions = [];

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "My Page",
    message: null,
    formData: null,
    errors: null,
  });
});
// Handle 500 errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Check the server logs.");
});

// Validation rules
const validateForm = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("age")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be between 18-100"),
  body("terms").exists().withMessage("You must accept the terms"),
];

// Form submission
app.post("/submit", validateForm, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("index", {
      title: "Advanced Form Demo",
      message: {
        type: "error",
        text: "Please fix the errors below",
      },
      formData: req.body,
      errors: errors.array(),
    });
  }

  formSubmissions.push(req.body);

  res.render("index", {
    title: "Advanced Form Demo",
    message: {
      type: "success",
      text: "Form submitted successfully!",
    },
    formData: null,
    errors: null,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
