// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-a6b1e.firebaseapp.com",
  projectId: "vingo-a6b1e",
  storageBucket: "vingo-a6b1e.firebasestorage.app",
  messagingSenderId: "760543799662",
  appId: "1:760543799662:web:41fb26ecd4ba622ae8397f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}
