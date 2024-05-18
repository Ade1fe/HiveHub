import { sendEmailVerification, signInWithPopup, User } from "firebase/auth";
import { auth, FacebookUser, firestore } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


//  FACEBOOK SIGNUP WITH POPUP FUNCTIONALITY
const facebookSignUp = async () => {
  try {
    const resp = await signInWithPopup(auth, FacebookUser);
    const user = resp.user;

    await storeUserData(user, 'Facebook');
  } 
  catch (err) {
    console.log(err);
  }
};

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
      // }

      userData = {
        username: getFirstName(user.displayName),
        email: user.email,
        provider: provider,
      };

      await setDoc(userDocRef, userData);
      await sendEmailVerification(user);
      console.log('Sign up successful and email verification sent');

    } 
    else {
      console.log('Sign In successful');
    }
  } catch (err) {
    console.log('Invalid User');
  }
};

//  CHECKING IF USER/READER IS ALREADY SIGNED UP
// const emailExists = async (email: string) => {
//   const userEmail = collection(firestore, 'Reader');
//   const emailQuery = query(userEmail, where('email', '==', email));
//   const result = await getDocs(emailQuery);
//   return !result.empty;
// };

//  GETTING THE USER/READER'S FIRST NAME FOR USERNAME
const getFirstName = (fullName: string) => {
  const name = fullName.split(' ');
  return name[0];
};



const FacebookAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
      if (user) {
        navigate('/hive-hub');
      }
    });
    return () => signedReader();
  }, [currentUser, navigate]);

  return (
    <div>

    </div>
  );
};

export { facebookSignUp, FacebookAuth };
