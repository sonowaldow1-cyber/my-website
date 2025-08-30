// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8eyBxqjjLuUulCdCVV9j5kQGn0AV9Eyw",
  authDomain: "my-website-e8ac5.firebaseapp.com",
  projectId: "my-website-e8ac5",
  storageBucket: "my-website-e8ac5.appspot.com",
  messagingSenderId: "641889905546",
  appId: "1:641889905546:web:73c5d6e7b67da2205e7673",
  measurementId: "G-DJQE9Q0ZLC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);