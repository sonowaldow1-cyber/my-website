import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// SIGN UP
window.signUp = function () {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("name", name);
      localStorage.setItem("dob", dob);
      localStorage.setItem("gender", gender);
      localStorage.setItem("email", email);

      document.getElementById("status").innerText = "✅ Sign Up Successful!";
      setTimeout(() => window.location.href = "home.html", 1000);
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ " + error.message;
    });
};

// LOGIN
window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("email", email);
      document.getElementById("status").innerText = "✅ Login Successful!";
      setTimeout(() => window.location.href = "home.html", 1000);
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ " + error.message;
    });
};

// LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    localStorage.clear();
    alert("🚪 Logged Out");
    window.location.href = "index.html";
  });
};

// SHOW PROFILE
if (window.location.pathname.includes("home.html")) {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = `
    <p><b>Name:</b> ${localStorage.getItem("name")}</p>
    <p><b>Email:</b> ${localStorage.getItem("email")}</p>
    <p><b>DOB:</b> ${localStorage.getItem("dob")}</p>
    <p><b>Gender:</b> ${localStorage.getItem("gender")}</p>
  `;
}