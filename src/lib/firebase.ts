import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Use environment variables if available (prefixed with VITE_ for Vite apps)
// This allows overriding the config without changing the code for production deployments.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId,
};

const app = initializeApp(config);
export const db = getFirestore(app, config.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom sign-in function using popup with locking and error handling
let isSigningIn = false;

export const signInWithGoogle = async () => {
  if (isSigningIn) {
    console.warn('Sign-in already in progress');
    return;
  }
  
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    // Handle common Firebase Auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the sign-in popup');
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.log('Sign-in popup request was cancelled');
    } else {
      console.error('Firebase Auth Error:', error.message);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Custom sign-out function
export const logOut = () => signOut(auth);

// Test connection strictly as required
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
