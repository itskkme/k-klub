
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdca_Wiwe65elosHLBsrKFuIJsf6rLZaU",
  authDomain: "k-klub-style-hub-v2.firebaseapp.com",
  projectId: "k-klub-style-hub-v2",
  storageBucket: "k-klub-style-hub-v2.appspot.com",
  messagingSenderId: "1060203641826",
  appId: "1:1060203641826:web:55b3ee434a1425ce1497bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Force Long Polling to avoid WebSocket issues (fixes "Connecting..." or timeout hangs)
// Disabled local cache to prevent sync loop issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}); // Replaces getFirestore(app)
export const storage = getStorage(app);
