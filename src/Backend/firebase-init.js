// firebase-init.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, 
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, 
  sendEmailVerification as firebaseSendEmailVerification 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBygesvHAoygl5FJ2WjYLk8-uTROfDmvSg",
  authDomain: "mindly-2f701.firebaseapp.com",
  projectId: "mindly-2f701",
  storageBucket: "mindly-2f701.appspot.com",
  messagingSenderId: "755821920973",
  appId: "1:755821920973:web:861ea6dd6a2022714f1f84",
  measurementId: "G-PC27WWN9RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the necessary Firebase methods and services
export { 
  auth, 
  db, 
  firebaseSignInWithEmailAndPassword as signInWithEmailAndPassword, 
  firebaseCreateUserWithEmailAndPassword as createUserWithEmailAndPassword, 
  firebaseSendEmailVerification as sendEmailVerification 
};
