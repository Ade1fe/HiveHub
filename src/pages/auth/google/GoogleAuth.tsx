import { sendEmailVerification, signInWithPopup, User } from "firebase/auth"
import { auth, firestore, GoogleUser } from "../../../firebase"
import { collection, doc, getDoc, getDocs, query, setDoc, where, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";


//  GOOGLE SIGNUP WITH POPUP FUNCTIONALITY
export const googleSignUp = async (setError: (message: string) => void, navigate: any) => {
  try {
    const resp = await signInWithPopup(auth, GoogleUser);
    const user = resp.user;

    await storeUserData(user, 'Google', navigate);
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
const storeUserData = async (user: any, provider: string, navigate: any) => {
  try {
    const checkEmailExists = await emailExists(user.email);

    if (checkEmailExists) {
      if (provider === 'Facebook') {
        showToastMessage('Email already exists, signing in with Facebook', 'warning');
        navigate('/hive-hub');
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
      showToastMessage('Sign up successful and email verification sent', 'success');
      navigate('/hive-hub');
    }
    else {
      showToastMessage('Sign in successful', 'success');
      navigate('/hive-hub');
    }
  }
  catch (err) {
    console.log('Invalid User: ', err);
    showToastMessage('Authentication failed: ' + err, 'error');
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

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
    });
    return () => signedReader();
  }, [currentUser]);

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