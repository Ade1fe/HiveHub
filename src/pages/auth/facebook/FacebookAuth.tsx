import { getRedirectResult, sendEmailVerification, signInWithRedirect, User } from "firebase/auth";
import { auth, FacebookUser, firestore } from "../../../firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


//  FACEBOOK SIGNUP WITH POPUP FUNCTIONALITY
// const facebookSignUp = async (navigate: any) => {
//   try {
//     const resp = await signInWithPopup(auth, FacebookUser);
//     const user = resp.user;

//     await storeUserData(user, 'Facebook', navigate);
//   } 
//   catch (err: any) {
//     if (err.message === 'Email already exists, cannot create new user') {
//       showToastMessage(err.message, 'warning');
//       navigate('/hive-hub');
//     }
//     else {
//       console.log('An error occurred:', err);
//       showToastMessage('Sign up failed: ' + err.message, 'error');
//     }
//   }
// };

const facebookSignUp = async () => { // Removed 'navigate: any'
    try {
        await signInWithRedirect(auth, FacebookUser);
    }
    // ... error handling remains the same (without navigate calls inside here)
    catch (err: any) {
        if (err.message === 'Email already exists, cannot create new user') {
            showToastMessage(err.message, 'warning');
            // Remove navigate('/hive-hub');
            return { status: 'signedIn' };
        } else {
            console.log('An error occurred:', err);
            showToastMessage('Sign up failed: ' + err.message, 'error');
        }
    }
}

//  SIGNING UP USER/READER AND SAVING THEIR DATA
const storeUserData = async (user: any, provider: string) => {
  try {
    const checkEmailExists = await emailExists(user.email);

    if (checkEmailExists) {
      // if (provider === 'Google') {
        showToastMessage('Email already exists, signing in with Google', 'warning');
        // navigate('/hive-hub');
      return { status: 'signedIn' };
      // }
      // else {
        // throw new Error('Email already exists, cannot create new user');
      // }
      
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
      // navigate('/hive-hub');
      return { status: 'signedUp' };
    } 
    // else {
    showToastMessage('Sign in successful', 'success');
    //   navigate('/hive-hub');
    return { status: 'signedIn' };
    // }
  } catch (err: any) {
    console.log('Invalid User', err);
    showToastMessage('Authentication failed: ' + err.message, 'error');
    return { status: 'error', message: err.message };
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
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  // @ts-ignore
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result) {
          const user = result.user;

          const resultStatus = await storeUserData(user, 'Facebook');

          if (resultStatus.status === 'signedIn' || resultStatus.status === 'signedUp') {
            navigate('/hive-hub');
          }
        }
      } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          showToastMessage('Email already in use with a different sign-in method.', 'error');
        } else {
          console.error('Facebook Redirect Error:', error);
          showToastMessage('Sign in failed: ' + error.message, 'error');
        }
      }
    };

    handleRedirectResult();
  }, [navigate]);

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
    });
    return () => signedReader();
  }, [currentUser]);

  return (
    <div>
      {/* <Toaster
        position='top-right'
        visibleToasts={2}
        dir='rtl'
        theme="light"
        invert={true}
        expand={true}
        richColors
        closeButton
      /> */}
    </div>
  );
};

export { facebookSignUp, FacebookAuth };
