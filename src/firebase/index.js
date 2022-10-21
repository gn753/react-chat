// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbGPTZovZLryRjUnUgIw_Ti6f2WEG1cMc",
  authDomain: "chat-app-9d926.firebaseapp.com",
  databaseURL:
    "https://chat-app-9d926-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-9d926",
  storageBucket: "chat-app-9d926.appspot.com",
  messagingSenderId: "315025658098",
  appId: "1:315025658098:web:5e93ca7c3e623139f5006b",
  measurementId: "G-SF134ZJP0J",
};

// Initialize Firebase
initializeApp(firebaseConfig);
