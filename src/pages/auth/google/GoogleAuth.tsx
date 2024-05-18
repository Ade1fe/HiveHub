import { sendEmailVerification, signInWithPopup, User } from "firebase/auth"
import { auth, firestore, GoogleUser } from "../../../firebase"
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


// const navigate = useNavigate();

//  GOOGLE SIGNUP WITH POPUP FUNCTIONALITY
export const googleSignUp = async () => {
  try {
    const resp = await signInWithPopup(auth, GoogleUser);
    const user = resp.user;
    console.log(user);

    await storeUserData(user, 'Google');
  }
  catch (err) {
    console.log(err);
  }
}


//  SIGNING UP USER/READER AND SAVING THEIR DATA
const storeUserData = async (user: any, provider: string) => {
  try {
    const userDocRef = doc(firestore, 'Reader', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: any;

    if (!userDoc.exists()) {
      // const checkEmailExists = await emailExists(user.email);

      // if (checkEmailExists) {
      //   console.log('Email already exists');
      //   return;
      // }

      userData = {
        username: getFirstName(user.displayName),
        email: user.email,
        provider: provider,
      }

      await setDoc(userDocRef, userData);
      await sendEmailVerification(user);
      console.log('Sign up successful and email verification sent');

    }
    else {
      console.log('Sign In successful')
    }
  }
  catch (err) {
    console.log('Invalid User: ', err);
  }
}


//  CHECKING IF USER/READER IS ALREADY SIGNED UP
// const emailExists = async (email: any) => {
//   const userEmail = collection(firestore, 'Reader');
//   const emailQuery = query(userEmail, where('email', '==', email));
//   const result = await getDocs(emailQuery);
//   return !result.empty;
// };


//  GETTING THE USER/READER'S FIRSTNAME FOR USERNAME
const getFirstName = (fullName: string) => {
  const name = fullName.split(' ');
  return name[0];
};



const GoogleAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
      if (user) {
        navigate('hive-hub');
      }
    });
    return () => signedReader();
  }, [currentUser, navigate]);

  return (
    <div>

    </div>
  )
}

export  { GoogleAuth }