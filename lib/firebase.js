import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "digilab-a8f1b.firebaseapp.com",
  projectId: "digilab-a8f1b",
  storageBucket: "digilab-a8f1b.appspot.com",
  messagingSenderId: "262432472618",
  appId: "1:262432472618:web:a901e5b948b48cdb07cd53",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
