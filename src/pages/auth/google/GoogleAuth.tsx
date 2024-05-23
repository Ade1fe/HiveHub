import { sendEmailVerification, signInWithPopup, User } from "firebase/auth"
import { auth, firestore, GoogleUser } from "../../../firebase"
import { collection, doc, getDoc, getDocs, query, setDoc, where, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";


//  GOOGLE SIGNUP WITH POPUP FUNCTIONALITY
export const googleSignUp = async (setError: (message: string) => void) => {
  try {
    const resp = await signInWithPopup(auth, GoogleUser);
    const user = resp.user;
    console.log(user);

    await storeUserData(user, 'Google');
  }
  catch (err: any) {
    if (err.message === 'Email already exists, cannot create new user') {
      setError(err.message);
      showToastMessage(err.message, 'warning');
    } else {
      console.log('An error occurred:', err);
    }
  }
}


//  SIGNING UP USER/READER AND SAVING THEIR DATA
const storeUserData = async (user: any, provider: string) => {
  try {
    const checkEmailExists = await emailExists(user.email);

    if (checkEmailExists) {
      if (provider === 'Facebook') {
        console.log('Email already exists, signing in with Facebook');
        showToastMessage('Email already exists, signing in with Facebook', 'warning');
        return;
      }
      else {
        // showToastMessage('Email already exists, cannot create new user', 'warning');
        throw new Error('Email already exists, cannot create new user');
      }
      
    }

    const userDocRef = doc(firestore, 'Reader', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: any;

    if (!userDoc.exists()) {
      userData = {
        username: getFirstName(user.displayName),
        email: user.email,
        provider: provider,
        userImage: user.photoURL,
      }

      await setDoc(userDocRef, userData);
      await sendEmailVerification(user);
      console.log('Sign up successful and email verification sent');
      showToastMessage('Sign up successful and email verification sent', 'success');
    }
    else {
      console.log('Sign In successful');
      showToastMessage('Sign in successful', 'success');
    }
  }
  catch (err) {
    console.log('Invalid User: ', err);
    // showToastMessage('Invalid user:' + err, 'error');
  }
}


//  CHECKING IF USER/READER IS ALREADY SIGNED UP
const emailExists = async (email: string | null) => {
  if (!email) return false;

  const userEmail = collection(firestore, 'Reader');
  const emailQuery = query(userEmail, where('email', '==', email));
  const result = await getDocs(emailQuery);

  return !result.empty;
};


//  GETTING THE USER/READER'S FIRSTNAME FOR USERNAME
const getFirstName = (fullName: string) => {
  const name = fullName.split(' ');
  return name[0];
};





  //   CONFIGURING TOAST TO TOAST MESSAGE
const showToastMessage = ( message: any, type: any ) => {
  switch (type) {
      case 'success':
          toast.success(message, {
              position: 'top-right',
              duration: 3000,
          });
          break;
      case 'error':
          toast.error(message, {
              position: 'top-right',
              duration: 3000,
          });
          break;
      case 'warning':
          toast.warning(message, {
              position: 'top-right',
              duration: 3000,
          });
          break;
      default:
          break;
    }
  };






const GoogleAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  // @ts-ignore
  const [error, setError] = useState<string | null>(null);
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
      <Toaster
        position='top-right'
        visibleToasts={2}
        dir='rtl'
        theme="light"
        invert={true}
        expand={true}
        richColors
        closeButton
      />
    </div>
  )
}

export  { GoogleAuth }