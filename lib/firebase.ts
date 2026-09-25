import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigData from '../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || "AIzaSyBsf-EwXaht0b7YHtoZT5U4snmmtzJVz4A",
  authDomain: firebaseConfigData.authDomain || "prompthub-a6f52.firebaseapp.com",
  projectId: firebaseConfigData.projectId || "prompthub-a6f52",
  storageBucket: firebaseConfigData.storageBucket || "prompthub-a6f52.firebasestorage.app",
  messagingSenderId: firebaseConfigData.messagingSenderId || "984066675771",
  appId: firebaseConfigData.appId || "1:984066675771:web:02c8e6ce97c624c64b381e",
  measurementId: firebaseConfigData.measurementId || "G-G58RHFRQS8"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app, firebaseConfigData.firestoreDatabaseId || "(default)");
export const auth: Auth = getAuth(app);
export default app;
