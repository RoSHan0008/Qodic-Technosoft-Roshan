import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6b_PcPIwDYHkI2MNaABqVaGLhND6fcvw",
  authDomain: "auth-69a96.firebaseapp.com",
  projectId: "auth-69a96",
  storageBucket: "auth-69a96.appspot.com",
  messagingSenderId: "397780137623",
  appId: "1:397780137623:web:5ae09476c7452267b29bd2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export default app;
