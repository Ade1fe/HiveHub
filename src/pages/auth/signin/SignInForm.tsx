import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth, firestore } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
// import Toast from "../../../toast/Toast";


const readReader = async (email: string, password: string, navigate: any) => {
  try {
    if (email === '' || password === '') {
      showToastMessage('Please fill in both email and password.', 'error');
      return;
    }

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
  catch (err) {
    if (email === '' || password === '') {
      showToastMessage('Please fill in both email and password.', 'error');
    } 
    else {
      showToastMessage('Invalid email or password', 'error');
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
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const signedReader = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(user);
    });
    return () => signedReader();
  }, [currentUser]);
  
  return (
    <div>
      <Toaster position='top-right' z-index='9999' visibleToasts={2} dir='rtl' theme="light" invert={true} expand={true} richColors closeButton />
      {/* <Toast showToast={showToastMessage} /> */}
    </div>
  )
}

export { readReader, SignInForm }