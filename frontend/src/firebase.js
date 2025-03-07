// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBJQYYhd2JTCuEy6u8JqzAeLq_UwLy2i-w",
    authDomain: "ecommerceapp-girls123.firebaseapp.com",
    projectId: "ecommerceapp-girls123",
    storageBucket: "ecommerceapp-girls123.firebasestorage.app",
    messagingSenderId: "248505276769",
    appId: "1:248505276769:web:25ff71ed9f0812cf68cd20",
    measurementId: "G-34WZ8LSXGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
