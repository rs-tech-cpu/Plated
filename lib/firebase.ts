import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Fill these in from your Firebase project settings
// (Firebase Console → Project Settings → Your Apps → SDK setup)
const firebaseConfig = {
  apiKey: "AIzaSyAO9XDBvLn5nI5X-f_RUtu6BU6Tu1-k53s",
  authDomain: "plated-1e15d.firebaseapp.com",
  projectId: "plated-1e15d",
  storageBucket: "plated-1e15d.firebasestorage.app",
  messagingSenderId: "521948762268",
  appId: "1:521948762268:web:2af6674377c1ede070dd59",
  measurementId: "G-GX1T3EB656"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);
