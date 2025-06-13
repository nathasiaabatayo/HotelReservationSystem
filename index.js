import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth and expose it for logout()
const auth = getAuth(app);
window.firebaseAuth = auth;

// --- Room price logic (NEW!) ---
function setRoomPrice(roomType) {
  const priceField = document.getElementById('price-reserve');
  const priceBox = document.getElementById('price-box-reserve');
  let price = "";
  switch(roomType) {
    case "single":
      price = "₱900/Night";
      break;
    case "queen":
      price = "₱1500/Night";
      break;
    case "double":
      price = "₱2000/Night";
      break;
    default:
      price = "";
  }
  if (priceField) priceField.value = price;
  if (priceBox) priceBox.textContent = price;
}

// Ensure price updates on room type change
document.getElementById('roomtype-reserve')?.addEventListener('change', function(e) {
  setRoomPrice(this.value);
});

// If you have buttons that trigger the reservation form with a chosen roomtype
document.querySelectorAll('.reserve-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // If you want to set the price when the reservation form opens, do it here if needed
    setRoomPrice(this.dataset.roomtype);
  });
});

// Optionally, set initial price on page load (for default selected room)
window.addEventListener('DOMContentLoaded', function() {
  const roomType = document.getElementById('roomtype-reserve')?.value;
  if(roomType) setRoomPrice(roomType);
});

// Reservation form logic
document.querySelector('.reservation-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name-reserve').value;
  const room = document.getElementById('roomtype-reserve').value;
  const price = document.getElementById('price-reserve').value;
  const checkin = document.getElementById('checkin-reserve').value;
  const checkout = document.getElementById('checkout-reserve').value;
  // guests is skipped to follow your field order exactly
  try {
    await addDoc(collection(db, "reservations"), {
      name,
      room,
      price,
      "check in": checkin,
      "check out": checkout,
      createdAt: new Date().toISOString()
    });
    alert('Reservation saved!');
    e.target.reset();
    // Optionally reset the price field and price box
    setRoomPrice(document.getElementById('roomtype-reserve').value);
  } catch (error) {
    alert('Error saving reservation: ' + error.message);
  }
});

// Log out function for use in your HTML
window.logout = function() {
  // If using Firebase Auth, sign out
  signOut(auth).then(() => {
    window.location.href = "auth.html"; // Redirect to your login/auth page
  }).catch((error) => {
    // Even if sign out fails, redirect to login page
    window.location.href = "auth.html";
  });
};