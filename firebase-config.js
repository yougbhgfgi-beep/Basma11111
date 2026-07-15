// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLtJBvw327412AhWb1Bve9HuPYtkfnr4Q",
  authDomain: "sherif-ceb45.firebaseapp.com",
  projectId: "sherif-ceb45",
  storageBucket: "sherif-ceb45.firebasestorage.app",
  messagingSenderId: "707625325547",
  appId: "1:707625325547:web:60c19572a75087b4803fae",
  measurementId: "G-4DNPDQ53P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };
