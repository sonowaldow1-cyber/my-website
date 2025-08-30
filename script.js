// Sign Up Function
window.signUp = async function () {
  const name = document.getElementById("signupName").value;
  const dob = document.getElementById("signupDob").value;
  const gender = document.getElementById("signupGender").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      name, dob, gender, email
    });

    showMessage("✅ Account created! Please login.", "success");

    // 🔥 Sign Up form গোপন কৰি Login form দেখুৱাওক
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";

  } catch (error) {
    showMessage("❌ " + error.message, "error");
  }
};