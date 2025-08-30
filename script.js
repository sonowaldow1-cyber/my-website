import { getAuth, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up
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
    window.location.href = "index.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
};

// Login
window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("✅ Logged in!");
    window.location.href = "home.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
};

// Logout
window.logout = async function () {
  await signOut(auth);
  alert("🚪 Logged out!");
  window.location.href = "index.html";
};

// Show Profile Data in home.html
onAuthStateChanged(auth, async (user) => {
  if (user && document.getElementById("profileCard")) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      document.getElementById("profileName").innerText = snap.data().name;
      document.getElementById("profileEmail").innerText = snap.data().email;
      document.getElementById("profileDob").innerText = snap.data().dob;
      document.getElementById("profileGender").innerText = snap.data().gender;
    }
  }
});