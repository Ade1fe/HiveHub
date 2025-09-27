import { useNavigate } from 'react-router-dom';
import { signInWithPopup, User, AuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { showToastMessage, getFirstName } from '../utils/helpers';

// const getProviderName = (providerId: string) => {
//   if (providerId.includes('google')) return 'Google';
//   if (providerId.includes('facebook')) return 'Facebook';
//   return 'Unknown';
// };

const processRedirectUser = async (user: User, providerName: string) => {
  try {
    const userDocRef = doc(firestore, 'Reader', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // showToastMessage('Sign in successful', 'success');
      return { status: 'signedIn' };
    } else {
      // New User Sign Up (only runs if user doesn't exist in Firestore)
      const userData = {
        username: getFirstName(user.displayName || user.email?.split('@')[0] || 'Reader'),
        email: user.email,
        provider: providerName,
        userImage: user.photoURL,
        createdAt: new Date(),
      };
      await setDoc(userDocRef, userData);
      await sendEmailVerification(user); // Uncomment if needed
      // showToastMessage('Sign up successful and profile created!', 'success');
      return { status: 'signedUp' };
    }
  }
  catch (error: any) {
    console.error('Firestore/Processing Error:', error);
    showToastMessage('Failed to create or update user profile.', 'error');
    return { status: 'error', message: error.message };
  }
};

// --- Custom Hook ---

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  // useEffect to handle the redirect result upon return to the landing page
  // useEffect(() => {
  //   const handleResult = async () => {
  //     try {
  //       const result = await getRedirectResult(auth);

  //       console.log('Redirect Result:', result);
  //       console.log('User Info:', result?.user);

  //       if (result) {
  //         const providerId = result.providerId;
  //         const providerName = providerId?.includes('google') ? 'Google' : 'Facebook';
          
  //         const resultStatus = await processRedirectUser(result.user, providerName);

  //         console.log('Post-Processing Result Status:', resultStatus);
  //         console.log('Status:', resultStatus.status);
          
  //         // Navigation happens only after successful processing
  //         if (resultStatus.status === 'signedIn' || resultStatus.status === 'signedUp') {
  //           navigate('/hive-hub');
  //         }
  //       }
  //     }
  //     catch (error: any) {
  //       console.error('Redirect Sign-in Error:', error);
  //       if (error.code === 'auth/account-exists-with-different-credential') {
  //         showToastMessage('Email already in use with a different sign-in method.', 'error');
  //       } else {
  //         showToastMessage('Authentication failed: ' + error.message, 'error');
  //       }
  //     }
  //   };

  //   handleResult();
  // }, [navigate]);


  // Function exposed for buttons to initiate sign-in
  const initiateSignIn = async (provider: AuthProvider, providerName: string) => {
    try {
      const result = await signInWithPopup(auth, provider);

      const resultStatus = await processRedirectUser(result.user, providerName);
          
      // Navigation happens only after successful processing
      if (resultStatus.status === 'signedIn' || resultStatus.status === 'signedUp') {
        const toastMessage = resultStatus.status === 'signedUp' ? 'Sign up successful and profile created' : 'Sign in successful';
        navigate('/hive-hub', { 
          state: { 
            toastMessage: toastMessage,
            toastType: 'success'
          }
        });
      }
      // The browser navigates away immediately.
    }
    catch (error: any) {
      console.error(`Error initiating ${providerName} redirect:`, error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        showToastMessage('Email already in use with a different sign-in method.', 'error');
      } else {
        showToastMessage('Authentication failed: ' + error.message, 'error');
      }
    }
  };

  return { initiateSignIn };
};