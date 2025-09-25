import { sendEmailVerification, signInWithPopup, User } from "firebase/auth";
import { auth, FacebookUser, firestore } from "../../../firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";


//  FACEBOOK SIGNUP WITH POPUP FUNCTIONALITY
const facebookSignUp = async (setError: (message: string) => void, navigate: any) => {
  try {
    const resp = await signInWithPopup(auth, FacebookUser);
    const user = resp.user;

    await storeUserData(user, 'Facebook', navigate);
  } 
  catch (err: any) {
    if (err.message === 'Email already exists, cannot create new user') {
      setError(err.message);
      showToastMessage(err.message, 'warning');
    } else {
      console.log('An error occurred:', err);
    }
  }
};

//  SIGNING UP USER/READER AND SAVING THEIR DATA
const storeUserData = async (user: any, provider: string, navigate: any) => {
  try {
    const checkEmailExists = await emailExists(user.email);

    if (checkEmailExists) {
      if (provider === 'Google') {
        showToastMessage('Email already exists, signing in with Google', 'warning');
        navigate('/hive-hub');
        return;
      }
      else {
        throw new Error('Email already exists, cannot create new user');
      }
      
    }

    const userDocRef = doc(firestore, 'Reader', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: any;

    if (!userDoc.exists()) {
      userData = {
        username: getFirstName(user.displayName || ''),
        email: user.email,
        provider: provider,
      };

      await setDoc(userDocRef, userData);
      await sendEmailVerification(user);
      showToastMessage('Sign up successful and email verification sent', 'success');
      navigate('/hive-hub');
    } 
    else {
      showToastMessage('Sign in successful', 'success');
      navigate('/hive-hub');
    }
  } catch (err) {
    console.log('Invalid User');
    showToastMessage('Authentication failed: ' + err, 'error');
  }
};

//  CHECKING IF USER/READER IS ALREADY SIGNED UP
const emailExists = async (email: string | null) => {
  if (!email) return false;

  const userEmail = collection(firestore, 'Reader');
  const emailQuery = query(userEmail, where('email', '==', email));
  const result = await getDocs(emailQuery);

  return !result.empty;
};

//  GETTING THE USER/READER'S FIRST NAME FOR USERNAME
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





const FacebookAuth = () => {
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
  );
};

export { facebookSignUp, FacebookAuth };
