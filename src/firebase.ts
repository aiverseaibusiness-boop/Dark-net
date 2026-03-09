import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDHSR9cmdE_Pb0FrEFYyv8VyksJbPYrZNA",
  authDomain: "network-bb050.firebaseapp.com",
  projectId: "network-bb050",
  storageBucket: "network-bb050.firebasestorage.app",
  messagingSenderId: "1014127364485",
  appId: "1:1014127364485:web:f9bdf97ce26cb1ce949cec",
  measurementId: "G-6KBZLHZM3E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
