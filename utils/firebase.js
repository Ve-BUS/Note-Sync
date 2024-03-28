// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBgHMDqf22tLLei6SWPLoF42U45p36x_Vg",
    authDomain: "collab-notes-91bcb.firebaseapp.com",
    projectId: "collab-notes-91bcb",
    storageBucket: "collab-notes-91bcb.appspot.com",
    messagingSenderId: "459359842159",
    appId: "1:459359842159:web:ce888b9e0e6c863bb0029a",
    measurementId: "G-SBR0K0RWM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { app, auth }