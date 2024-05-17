import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from 'firebase/auth'
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user.uid);
  } else {
    console.log('User is logged out');
  }
});


export { onAuthStateChanged }
// // firebase.ts
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//     apiKey: "AIzaSyCemOs_j_yNCeEmTPE3bYWnUfhfW-e7Oeo",
//     authDomain: "fir-fin-3e351.firebaseapp.com",
//     projectId: "fir-fin-3e351",
//     storageBucket: "fir-fin-3e351.appspot.com",
//     messagingSenderId: "444934139311",
//     appId: "1:444934139311:web:867df21096c53d4f25535a"
//   };
  
  

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);

// // Listen for changes in authentication state
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log('User is logged in:', user.uid);
//     } else {
//       console.log('User is logged out');
//     }
//   });

// export { app, analytics, auth, firestore, storage, onAuthStateChanged };
