// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Firebase config (আপোনাৰ Firebase Project ৰ)
const firebaseConfig = {
  apiKey: "AIzaSyA8eyBxqjjLuUulCdCVV9j5kQGn0AV9Eyw",
  authDomain: "my-website-e8ac5.firebaseapp.com",
  projectId: "my-website-e8ac5",
  storageBucket: "my-website-e8ac5.firebasestorage.app",
  messagingSenderId: "641889905546",
  appId: "1:641889905546:web:73c5d6e7b67da2205e7673",
  measurementId: "G-DJQE9Q0ZLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

// ========== Functions ==========

// Sign Up (Email/Password)
window.signup = function() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(userCredential => {
      alert("✅ Signup successful: " + userCredential.user.email);
    })
    .catch(error => {
      alert("⚠️ " + error.message);
    });
}

// Login (Email/Password)
window.login = function() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(userCredential => {
      alert("✅ Login successful: " + userCredential.user.email);
    })
    .catch(error => {
      alert("⚠️ " + error.message);
    });
}

// Google Login
window.googleLogin = function() {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      alert("✅ Google Login successful: " + user.email);
    })
    .catch(error => {
      alert("⚠️ " + error.message);
    });
}

// Logout
window.logout = function() {
  signOut(auth)
    .then(() => {
      alert("👋 Logged out successfully");
    })
    .catch(error => {
      alert("⚠️ " + error.message);
    });
}

// Track user state
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("status").innerText = "Logged in as: " + user.email;
  } else {
    document.getElementById("status").innerText = "Not logged in";
  }
});