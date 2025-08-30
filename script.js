import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Show User Info in Card
async function showUserCard(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("cardName").textContent = data.name || "N/A";
    document.getElementById("cardEmail").textContent = data.email;
    document.getElementById("cardDob").textContent = data.dob || "N/A";
    document.getElementById("cardGender").textContent = data.gender || "N/A";

    document.getElementById("userCard").classList.remove("hidden");
  }
}

// After Login Success
createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;

    // Save extra info...
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      dob: dob,
      gender: gender,
      email: user.email,
      createdAt: new Date()
    });

    showMessage("✅ Account Created & Info Saved for: " + user.email, "success");

    // Show Profile Card
    showUserCard(user);
  });