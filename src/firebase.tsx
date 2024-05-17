import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDi1RTxULn0ES75-c_BckdG6XxkcLugf_Y",
  authDomain: "hivehub-5d128.firebaseapp.com",
  projectId: "hivehub-5d128",
  storageBucket: "hivehub-5d128.appspot.com",
  messagingSenderId: "795145258849",
  appId: "1:795145258849:web:2a6a2135794940d707a720",
  measurementId: "G-K3LQWPQE16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const GoogleUser = new GoogleAuthProvider();
export const FacebookUser = new FacebookAuthProvider();