import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase and Firestore ONCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- UI logic for switching forms ---
function showSignup(e) {
  if (e) e.preventDefault();
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'flex';
}
function showLogin(e) {
  if (e) e.preventDefault();
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'flex';
}

document.getElementById('showSignupLink').addEventListener('click', showSignup);
document.getElementById('showLoginLink').addEventListener('click', showLogin);

// --- SIGNUP ---
document.getElementById('signupForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value.trim();
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    // Add user to Firestore
    await addDoc(collection(db, "users"), {
      uid: userCred.user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });
    alert('Sign up successful! Please log in.');
    showLogin();
    document.getElementById('signupForm').reset();
  } catch (error) {
    alert(error.message);
  }
});

// --- LOGIN ---
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Set session flag for index.html
    sessionStorage.setItem('fromAuth', 'yes');
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});

// On page load, always show login form
showLogin();