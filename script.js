// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signOut, 
         GoogleAuthProvider, 
         signInWithPopup, 
         onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Your Firebase Config
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const statusDiv = document.getElementById("status");

// ✨ Signup Function
window.signup = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      statusDiv.innerHTML = `✅ Account created: ${userCredential.user.email}`;
    })
    .catch(error => {
      statusDiv.innerHTML = `❌ Error: ${error.message}`;
    });
};

// ✨ Login Function
window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      statusDiv.innerHTML = `✅ Logged in as: ${userCredential.user.email}`;
    })
    .catch(error => {
      statusDiv.innerHTML = `❌ Error: ${error.message}`;
    });
};

// ✨ Google Login
window.googleLogin = function() {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      statusDiv.innerHTML = `
        <p>✅ Logged in with Google</p>
        <p><b>${user.displayName}</b> (${user.email})</p>
        <img src="${user.photoURL}" width="80">
      `;
    })
    .catch(error => {
      statusDiv.innerHTML = `❌ Error: ${error.message}`;
    });
};

// ✨ Logout
window.logout = function() {
  signOut(auth)
    .then(() => {
      statusDiv.innerHTML = "🚪 Logged out!";
    })
    .catch(error => {
      statusDiv.innerHTML = `❌ Error: ${error.message}`;
    });
};

// ✨ Realtime Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    statusDiv.innerHTML = `
      <p>✅ Logged in as: <b>${user.email}</b></p>
      ${user.photoURL ? `<img src="${user.photoURL}" width="80">` : ""}
    `;
  } else {
    statusDiv.innerHTML = "Not logged in";
  }
});