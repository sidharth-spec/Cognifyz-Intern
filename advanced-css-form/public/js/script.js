document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const togglePassword = document.querySelector(".toggle-password");
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector("i").classList.toggle("bi-eye");
      this.querySelector("i").classList.toggle("bi-eye-slash");
    });
  }

  // Form validation
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (event) {
      // Client-side validation can be added here
    });
  }
});
