import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDi1RTxULn0ES75-c_BckdG6XxkcLugf_Y",
  authDomain: "hivehub-5d128.firebaseapp.com",
  projectId: "hivehub-5d128",
  storageBucket: "hivehub-5d128.appspot.com",
  messagingSenderId: "795145258849",
  appId: "1:795145258849:web:2a6a2135794940d707a720",
  measurementId: "G-K3LQWPQE16"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const GoogleUser = new GoogleAuthProvider();
const FacebookUser = new FacebookAuthProvider();
const database = getDatabase(app);

// Listen for changes in authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
      return user;
    } else {
      return null;
    }
});

export { app, analytics, auth, firestore, storage, onAuthStateChanged, GoogleUser, FacebookUser, database };












