import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// CONFIGURATION REQUIRED
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Go to Project Settings > General > Your apps > Add App (Web)
// 4. Copy the 'firebaseConfig' object values and paste them below
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyB_c1ofrbfksr4R8JDtW1d1dKZsJszNt0s",
  authDomain: "budgetmanagement-288a0.firebaseapp.com",
  projectId: "budgetmanagement-288a0",
  storageBucket: "budgetmanagement-288a0.firebasestorage.app",
  messagingSenderId: "489224034857",
  appId: "1:489224034857:web:153de99469b58d17db9a38",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);