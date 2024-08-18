// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAeT3KiVwIu-0LJkmRNt2mZNFAwYMEcMkE",
    authDomain: "logic-857b1.firebaseapp.com",
    projectId: "logic-857b1",
    storageBucket: "logic-857b1.appspot.com",
    messagingSenderId: "102020406528",
    appId: "1:102020406528:web:d1b0bdb0b8a1a8f456a7e5",
    measurementId: "G-JK38CKL4RM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
