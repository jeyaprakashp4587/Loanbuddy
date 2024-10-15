import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWmzv0JQULc_gwpsv_9TvJFyAk6DpDqcw",
  authDomain: "loanbuddy-aa9c3.firebaseapp.com",
  projectId: "loanbuddy-aa9c3",
  storageBucket: "loanbuddy-aa9c3.appspot.com",
  messagingSenderId: "90097907920",
  appId: "1:90097907920:web:af78327435a7ff678d46d5",
  measurementId: "G-SST4SBPRNW",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage();
export { storage };
