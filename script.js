// script.js
import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// SIGN UP
export async function signupUser(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ Account Created! Please Login.");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
}

// LOGIN
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Logged in!");
    window.location.href = "home.html";
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
}

// LOGOUT
export async function logoutUser() {
  await signOut(auth);
  alert("🚪 Logged out!");
  window.location.href = "index.html";
}