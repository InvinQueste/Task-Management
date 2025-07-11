fetch("/backend/auth/authenticate.php")
  .then((res) => res.json())
  .then((data) => {
    if (data.loggedIn) {
      window.location.href = "/dashboard";
    }
  })
  .catch(() => {
    alert("Failed to check login status.");
    window.location.href = "/login";
  });
const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  fetch("/backend/auth/login.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      message.textContent = data.message;
      message.className = data.success ? "success" : "error";

      if (data.success) {
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    })
    .catch(() => {
      message.textContent = "Something went wrong.";
      message.className = "error";
    });
});
