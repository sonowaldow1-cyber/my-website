// Placeholder (Later Firebase code will be added)
function logout() {
  alert("Logged out!");
  window.location.href = "index.html";
}

document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  window.location.href = "home.html";
});

document.getElementById("signupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  window.location.href = "home.html";
});