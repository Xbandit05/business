import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with database ID from config as mandated by skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface GoogleAuthErrorInfo {
  code: string;
  message: string;
  domain: string;
  resolution: string;
  consoleUrl: string;
}

export function parseFirebaseAuthError(error: unknown): GoogleAuthErrorInfo {
  const err = error as { code?: string; message?: string } | null;
  const code = err?.code || 'unknown';
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig.projectId;
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  let resolution = 'Google Sign-In could not load. Please check your network and browser settings.';

  if (code === 'auth/unauthorized-domain') {
    resolution = `The domain "${domain}" is not authorized in Firebase. Add "${domain}" to Firebase Console > Authentication > Settings > Authorized Domains.`;
  } else if (code === 'auth/operation-not-allowed') {
    resolution = `Google Sign-In is not enabled. Go to Firebase Console > Authentication > Sign-in method > Enable Google.`;
  } else if (code === 'auth/popup-blocked') {
    resolution = `Browser or iframe blocked the Google popup window. Please allow popups for this site or open in a new tab.`;
  } else if (code === 'auth/popup-closed-by-user') {
    resolution = `Google authentication window was closed before completing sign-in.`;
  } else if (code === 'auth/cancelled-popup-request') {
    resolution = `Another sign-in window is already active. Please finish or close the other window.`;
  } else if (code === 'auth/network-request-failed') {
    resolution = `Network failure while reaching Google authentication servers.`;
  } else if (err?.message) {
    resolution = err.message;
  }

  return {
    code,
    message: err?.message || 'Authentication failed',
    domain,
    resolution,
    consoleUrl,
  };
}

// Helper for Google Sign-in with popup (preferred for AI Studio iframe preview)
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const parsed = parseFirebaseAuthError(error);
    console.error('Firebase Google Sign-In Diagnostic:', parsed);
    throw parsed;
  }
}

// Helper for Sign-out
export async function logOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

// Mandatory connection test on application startup
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify active internet connection and configuration.');
    }
  }
}

// Execute test connection on initial load
testFirestoreConnection();
