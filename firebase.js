// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-WlCPi7iGMC6Nm2soKQt9VtgIU_DBWlU",
  authDomain: "dating-app-test-901f8.firebaseapp.com",
  projectId: "dating-app-test-901f8",
  storageBucket: "dating-app-test-901f8.appspot.com",
  messagingSenderId: "935595452091",
  appId: "1:935595452091:web:b271dbcc23a96316a3eb9e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);