diff --git a/src/lib/firebase.ts b/src/lib/firebase.ts
index 2cd920b469b3a980b1329a224f141ccf6aa7500e..420eff59416179c2e9d2f6a41ca872fd37368574 100644
--- a/src/lib/firebase.ts
+++ b/src/lib/firebase.ts
@@ -1,65 +1,74 @@
 import { initializeApp } from 'firebase/app';
-import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
+import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
 import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
 import firebaseConfig from '../../firebase-applet-config.json';
 
-// Use environment variables if available (prefixed with VITE_ for Vite apps)
-// This allows overriding the config without changing the code for production deployments.
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
+googleProvider.setCustomParameters({ prompt: 'select_account' });
 
-// Custom sign-in function using popup with locking and error handling
 let isSigningIn = false;
 
+const redirectOnlyCodes = new Set([
+  'auth/popup-blocked',
+  'auth/popup-closed-by-user',
+  'auth/cancelled-popup-request',
+  'auth/operation-not-supported-in-this-environment',
+]);
+
 export const signInWithGoogle = async () => {
   if (isSigningIn) {
     console.warn('Sign-in already in progress');
     return;
   }
-  
+
   isSigningIn = true;
   try {
     const result = await signInWithPopup(auth, googleProvider);
     return result;
   } catch (error: any) {
-    // Handle common Firebase Auth errors
-    if (error.code === 'auth/popup-closed-by-user') {
-      console.log('User closed the sign-in popup');
-    } else if (error.code === 'auth/cancelled-popup-request') {
-      console.log('Sign-in popup request was cancelled');
+    if (redirectOnlyCodes.has(error?.code)) {
+      console.info(`Popup sign-in failed with ${error.code}. Falling back to redirect sign-in.`);
+      await signInWithRedirect(auth, googleProvider);
+      return;
+    }
+
+    if (error?.code === 'auth/unauthorized-domain') {
+      console.error(
+        `Firebase auth blocked this domain. Add your Vercel domain in Firebase Console → Authentication → Settings → Authorized domains. Current host: ${window.location.hostname}`
+      );
     } else {
-      console.error('Firebase Auth Error:', error.message);
+      console.error('Firebase Auth Error:', error?.message || error);
     }
+
     throw error;
   } finally {
     isSigningIn = false;
   }
 };
 
-// Custom sign-out function
 export const logOut = () => signOut(auth);
 
-// Test connection strictly as required
 async function testConnection() {
   try {
     await getDocFromServer(doc(db, 'test', 'connection'));
   } catch (error) {
     if (error instanceof Error && error.message.includes('the client is offline')) {
-      console.error("Please check your Firebase configuration.");
+      console.error('Please check your Firebase configuration.');
     }
   }
 }
 
 testConnection();
