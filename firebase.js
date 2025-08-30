// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);