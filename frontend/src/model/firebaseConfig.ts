import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  getAI,
  GoogleAIBackend,
  getGenerativeModel, // Make sure getGenerativeModel is imported!
  GenerativeModel // Make sure GenerativeModel (the type) is imported!
} from "firebase/ai"; // This is the correct package for the Firebase AI SDK for web


const firebaseConfig = {

  apiKey: "key placeholder",
  authDomain: "closit-db-test.firebaseapp.com",
  projectId: "ClosIT-db-test",
  storageBucket: "closit-db-test.firebasestorage.app",
  messagingSenderId: "500170850853",
  appId: "1:500170850853:web:41f46138e7221025fe35cc"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

// Initialize the Gemini Developer API backend service

const firebaseAI = getAI(app, {backend: new GoogleAIBackend()})

const aiServiceInstance = getAI(app, { backend: new GoogleAIBackend() });

export const aiModel: GenerativeModel = getGenerativeModel(aiServiceInstance, {
  model: "gemini-1.5-flash", // Or 'gemini-pro'
});
