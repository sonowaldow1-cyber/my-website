import { auth, db, storage } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  collection, addDoc, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// SIGN UP
window.signUp = function () {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("name", name);
      localStorage.setItem("dob", dob);
      localStorage.setItem("gender", gender);
      localStorage.setItem("email", email);
      alert("✅ Sign Up Successful!");
      window.location.href = "home.html";
    })
    .catch(err => alert("❌ " + err.message));
};

// LOGIN
window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("email", email);
      alert("✅ Login Successful!");
      window.location.href = "home.html";
    })
    .catch(err => alert("❌ " + err.message));
};

// FORGOT PASSWORD
window.forgotPassword = function () {
  const email = prompt("Enter your email:");
  sendPasswordResetEmail(auth, email)
    .then(() => alert("📩 Reset link sent to " + email))
    .catch(err => alert("❌ " + err.message));
};

// LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    localStorage.clear();
    alert("🚪 Logged out!");
    window.location.href = "index.html";
  });
};

// SEND CHAT MESSAGE
window.sendMessage = async function () {
  const message = document.getElementById("chatInput").value;
  if (!message) return;
  await addDoc(collection(db, "messages"), {
    text: message,
    user: localStorage.getItem("email"),
    time: serverTimestamp()
  });
  document.getElementById("chatInput").value = "";
  alert("💬 Message sent!");
};

// PHOTO UPLOAD
window.uploadPhoto = async function () {
  const file = document.getElementById("photoInput").files[0];
  if (!file) return alert("Please select a file");

  const storageRef = ref(storage, "uploads/" + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  alert("📸 Uploaded! File URL: " + url);
};