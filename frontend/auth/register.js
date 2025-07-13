const form = document.getElementById("registerForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("/Task-Management/backend/auth/register.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      messageDiv.textContent = data.message;
      messageDiv.className = data.success ? "success" : "error";
      if (data.success) {
        form.reset();
        setTimeout(() => {
          window.location.href = "/Task-Management/login";
        }, 1000);
      }
    })
    .catch((err) => {
      messageDiv.textContent = "Something went wrong.";
      messageDiv.className = "error";
    });
});
