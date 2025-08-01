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

// Enhanced Validation Rules
const validateForm = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores"),

  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must contain at least one special character"),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  body("age")
    .isInt({ min: 13, max: 120 })
    .withMessage("Age must be between 13-120"),

  body("website")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid website URL"),
];

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Advanced Form Validation",
    formData: null,
    errors: null,
    message: null,
  });
});

app.post("/submit", validateForm, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("index", {
      title: "Advanced Form Validation",
      formData: req.body,
      errors: errors.array(),
      message: {
        type: "error",
        text: "Please fix the errors below",
      },
    });
  }

  res.render("index", {
    title: "Advanced Form Validation",
    formData: null,
    errors: null,
    message: {
      type: "success",
      text: "Form submitted successfully!",
    },
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
