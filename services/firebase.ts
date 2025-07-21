import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  connectAuthEmulator,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  connectFirestoreEmulator,
  initializeFirestore
} from 'firebase/firestore';
import { 
  getStorage, 
  FirebaseStorage,
  connectStorageEmulator
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

// Initialize Firebase app
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
} else {
  app = getApps()[0];
  console.log('Firebase app already initialized');
}

// Initialize Auth with React Native persistence
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore
let firestore: Firestore;
try {
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true, // For better React Native compatibility
  });
} catch (error) {
  // If already initialized, get the existing instance
  firestore = getFirestore(app);
}

// Initialize Storage
const storage: FirebaseStorage = getStorage(app);

// Connect to emulators in development if needed
if (__DEV__ && Constants.expoConfig?.extra?.useFirebaseEmulators) {
  const EMULATOR_HOST = Constants.expoConfig.extra.emulatorHost || 'localhost';
  
  try {
    // Connect Auth emulator
    if (Constants.expoConfig.extra.authEmulatorPort) {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${Constants.expoConfig.extra.authEmulatorPort}`);
      console.log('Connected to Auth emulator');
    }
    
    // Connect Firestore emulator
    if (Constants.expoConfig.extra.firestoreEmulatorPort) {
      connectFirestoreEmulator(firestore, EMULATOR_HOST, Constants.expoConfig.extra.firestoreEmulatorPort);
      console.log('Connected to Firestore emulator');
    }
    
    // Connect Storage emulator
    if (Constants.expoConfig.extra.storageEmulatorPort) {
      connectStorageEmulator(storage, EMULATOR_HOST, Constants.expoConfig.extra.storageEmulatorPort);
      console.log('Connected to Storage emulator');
    }
  } catch (error) {
    console.warn('Failed to connect to Firebase emulators:', error);
  }
}

// Export Firebase services
export { app, auth, firestore, storage };
export const db = firestore; // Alias for consistency with other parts of the codebase
export type { FirebaseApp, Auth, Firestore, FirebaseStorage };

// Export common Firebase functions
export {
  // Auth
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export {
  // Firestore
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export {
  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// Console log for debugging
console.log('Firebase services initialized:', {
  hasAuth: !!auth,
  hasFirestore: !!firestore,
  hasStorage: !!storage,
  projectId: firebaseConfig.projectId,
});