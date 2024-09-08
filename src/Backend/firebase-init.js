// firebase-init.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyBygesvHAoygl5FJ2WjYLk8-uTROfDmvSg",
  authDomain: "mindly-2f701.firebaseapp.com",
  projectId: "mindly-2f701",
  storageBucket: "mindly-2f701.appspot.com",
  messagingSenderId: "755821920973",
  appId: "1:755821920973:web:861ea6dd6a2022714f1f84",
  measurementId: "G-PC27WWN9RF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification };
