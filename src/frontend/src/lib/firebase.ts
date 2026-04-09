/**
 * Firebase app initialization for GUCCORA.
 * Hardcoded configuration — no environment variables required.
 *
 * IMPORTANT — Firestore Security Rules:
 * This app uses custom database-based authentication (NOT Firebase Auth).
 * All Firestore reads/writes are performed without a Firebase Auth user session.
 * To prevent "Missing or insufficient permissions" errors, your Firestore
 * security rules MUST allow unauthenticated reads and writes:
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /{document=**} {
 *         allow read, write: if true;
 *       }
 *     }
 *   }
 *
 * Set these rules in the Firebase Console → Firestore Database → Rules tab.
 * For production, scope rules to specific collections instead of a wildcard.
 *
 * Similarly, Firebase Storage rules must allow unauthenticated uploads:
 *   allow read, write: if true;
 */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQkvum7l4INzi2hEe9sO3l7",
  authDomain: "guccora-d0921.firebaseapp.com",
  projectId: "guccora-d0921",
  storageBucket: "guccora-d0921.appspot.com",
  messagingSenderId: "974110971630",
  appId: "1:974110971630:web:2ee640db0f702f796a45ff",
};

// Avoid re-initializing on HMR
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Keep backward-compat alias
export const firebaseApp = app;

// Firestore instance — used for user registration and login (custom auth, NOT Firebase Auth)
export const db = getFirestore(app);

// Storage instance — used for product image uploads
export const storage = getStorage(app);
