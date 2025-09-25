import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth, firestore } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
// import Toast from "../../../toast/Toast";


const readReader = async (email: string, password: string, navigate: any) => {
  if (email === '' || password === '') {
    showToastMessage('Please fill in both email and password.', 'error');
    return;
  }

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const readerId = userCredential.user.uid;

    const userDocRef = doc(firestore, `Reader/${readerId}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // @ts-ignore
      const userData = userDoc.data();
      showToastMessage('Sign in successful', 'success');
      navigate('/hive-hub');
    }
    else {
      showToastMessage('No such user found', 'error');
    }
  }
  catch (err: any) {
    switch (err.code) {
      case 'auth/user-not-found':
        showToastMessage('No account found with this email', 'error');
        break;
      case 'auth/wrong-password':
        showToastMessage('Incorrect password', 'error');
        break;
      case 'auth/invalid-email':
        showToastMessage('Invalid email format', 'error');
        break;
      case 'auth/too-many-requests':
        showToastMessage('Too many failed attempts. Please try again later', 'error');
        break;
      default:
        showToastMessage('Sign in failed. Please try again', 'error');
        break;
    }
  }
}

  //   CONFIGURING TOAST TO TOAST MESSAGE
const showToastMessage = (message: any, type: 'success' | 'error' | 'warning') => {
  switch (type) {
      case 'success':
          toast.success(message, {
              position: 'top-right',
              duration: 3000,
              // preventDefault: true,
          });
          break;
      case 'error':
          toast.error(message, {
              position: 'top-right',
              duration: 3000,
              // preventDefault: true,
          });
          break;
      case 'warning':
          toast.warning(message, {
              position: 'top-right',
              duration: 3000,
              // preventDefault: true,
          });
          break;
      default:
          break;
    }
  };

const SignInForm = () => {
  // @ts-ignore
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
    });
    return () => signedReader();
  }, []);
  
  return (
    <div>
      <Toaster position='top-right' z-index='9999' visibleToasts={2} dir='rtl' theme="light" invert={true} expand={true} richColors closeButton />
      {/* <Toast showToast={showToastMessage} /> */}
    </div>
  )
}

export { readReader, SignInForm }