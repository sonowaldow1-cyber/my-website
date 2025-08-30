import { getAuth, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, 
         GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Login Function
window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("✅ Logged in!");
    // redirect to homepage or friends page
  } catch (err) {
    alert("❌ " + err.message);
  }
};

// Sign Up Function
window.signUp = async function () {
  const name = document.getElementById("signupName").value;
  const dob = document.getElementById("signupDob").value;
  const gender = document.getElementById("signupGender").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPassword").value;

  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      name, dob, gender, email
    });
    alert("🎉 Account created!");
    window.location.href = "index.html"; // redirect to login
  } catch (err) {
    alert("❌ " + err.message);
  }
};

// Google Login
window.googleLogin = async function () {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    alert("✅ Google Sign-in Success");
  } catch (err) {
    alert("❌ " + err.message);
  }
};