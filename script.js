// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase Config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyD-WlCPi7iGMC6Nm2soKQt9VtgIU_DBWlU",
  authDomain: "dating-app-test-901f8.firebaseapp.com",
  projectId: "dating-app-test-901f8",
  storageBucket: "dating-app-test-901f8.appspot.com",
  messagingSenderId: "935595452091",
  appId: "1:935595452091:web:b271dbcc23a96316a3eb9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Logged in as: " + userCredential.user.email);
    window.location.href = "home.html";
  } catch (error) {
    alert("❌ Login Failed: " + error.message);
  }
});

// 🔹 Sign Up
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("🎉 Account Created: " + userCredential.user.email);
    window.location.href = "home.html";
  } catch (error) {
    alert("❌ Sign Up Failed: " + error.message);
  }
});

// 🔹 Logout
window.logout = async function () {
  await signOut(auth);
  alert("🚪 Logged out!");
  window.location.href = "index.html";
};