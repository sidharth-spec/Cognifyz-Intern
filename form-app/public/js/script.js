document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initPasswordStrengthMeter();
  initRealTimeValidation();
  initTooltips();
  initAnimatedLabels();
  initFormSubmission();

  // Add floating label effect
  document.querySelectorAll(".form-control").forEach((input) => {
    input.addEventListener("focus", addFloatingEffect);
    input.addEventListener("blur", removeFloatingEffect);
    if (input.value) addFloatingEffect({ target: input });
  });
});

function initPasswordStrengthMeter() {
  const passwordInput = document.getElementById("password");
  const strengthMeter = document.getElementById("password-strength");

  passwordInput.addEventListener("input", function () {
    const strength = calculatePasswordStrength(this.value);
    updateStrengthMeter(strength);
  });

  function calculatePasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character diversity
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 5);
  }

  function updateStrengthMeter(strength) {
    const colors = ["#dc3545", "#fd7e14", "#ffc107", "#28a745", "#20c997"];
    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

    strengthMeter.innerHTML = `
            <div class="strength-meter">
                <div class="strength-meter-fill" style="width: ${
                  strength * 20
                }%; background: ${colors[strength - 1]}"></div>
            </div>
            <small class="text-muted">${labels[strength - 1] || ""}</small>
        `;
  }
}

function initRealTimeValidation() {
  const form = document.getElementById("registrationForm");

  form.addEventListener("input", function (e) {
    if (e.target.matches("[name]")) {
      validateField(e.target);
    }
  });

  function validateField(field) {
    // Clear previous states
    field.classList.remove("is-invalid", "is-valid");
    const feedback = getFeedbackElement(field);

    // Field-specific validation
    let isValid = true;
    let message = "";

    switch (field.name) {
      case "username":
        if (field.value.length < 3) {
          isValid = false;
          message = "Username must be at least 3 characters";
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          message = "Please enter a valid email";
        }
        break;

      case "password":
        if (field.value.length < 8) {
          isValid = false;
          message = "Password must be at least 8 characters";
        }
        break;
    }

    // Update UI
    if (!isValid && field.value) {
      field.classList.add("is-invalid");
      if (feedback) feedback.textContent = message;
    } else if (field.value) {
      field.classList.add("is-valid");
    }
  }
}

function initTooltips() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: "hover focus",
    });
  });
}

function initAnimatedLabels() {
  document.querySelectorAll(".form-floating").forEach((floating) => {
    const input = floating.querySelector(".form-control");
    input.addEventListener("focus", () => {
      floating.querySelector("label").classList.add("active");
    });
    input.addEventListener("blur", () => {
      if (!input.value) {
        floating.querySelector("label").classList.remove("active");
      }
    });
  });
}

function initFormSubmission() {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    document.querySelectorAll("[name]").forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (isValid) {
      // Show success animation
      document.querySelector(".card").classList.add("animate-fade-in");

      // Simulate form submission
      setTimeout(() => {
        form.reset();
        showSuccessMessage();
      }, 1000);
    } else {
      // Scroll to first error
      document.querySelector(".is-invalid")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  function showSuccessMessage() {
    const alert = document.createElement("div");
    alert.className = "alert alert-success animate-fade-in";
    alert.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            Registration successful! Thank you.
        `;
    document.querySelector(".card-body").prepend(alert);

    setTimeout(() => {
      alert.classList.add("fade-out");
      setTimeout(() => alert.remove(), 500);
    }, 3000);
  }
}

// Helper functions
function getFeedbackElement(field) {
  return field.nextElementSibling?.classList.contains("invalid-feedback")
    ? field.nextElementSibling
    : field.parentElement.nextElementSibling;
}

function addFloatingEffect(e) {
  const input = e.target;
  if (input.value) {
    input.parentElement.querySelector("label").classList.add("active");
  }
}

function removeFloatingEffect(e) {
  const input = e.target;
  if (!input.value) {
    input.parentElement.querySelector("label").classList.remove("active");
  }
}
