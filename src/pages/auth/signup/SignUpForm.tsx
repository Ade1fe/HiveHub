import { createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth"
import { auth, firestore, storage } from "../../../firebase"
import { addDoc, collection, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImageFile from '../../../assets/user.png'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toaster, toast } from "sonner";
// import Toast from "../../../toast/Toast";

const createReader = async (username: string, email: string, password: string) => {
  try {
    const validatePassword = (password: string) => {
      const passwordRegex = /^[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    }
  
    if (!validatePassword(password)) {
      console.log('Password must be at least 8 characters long');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (userCredential && userCredential.user) {
      const readerId = userCredential.user.uid;
      try {
        const userDocRef = collection(firestore, 'Reader');

        const response = await fetch(defaultImageFile);
        const defaultImageBlob = await response.blob();

        const defaultImageRef = ref(storage, `userImages/${readerId}/user.png`);
        await uploadBytes(defaultImageRef, defaultImageBlob);

        const userImageUrl = await getDownloadURL(defaultImageRef);

        await addDoc(userDocRef, {
          username: username,
          email: email,
          userImage: userImageUrl,
        });

        await sendEmailVerification(userCredential.user);
        console.log('Sign up successful and email verification sent');
        showToastMessage('Sign up successful and email verification sent', 'success');
        console.log(showToastMessage);
      }
      catch (err) {
        await userCredential.user.delete();
        throw err;
      }
    }
    else {
      console.log('Sign up failed');
      showToastMessage('Sign up failed', 'error');
      console.log(showToastMessage);
    }
  }
  catch (err: any) {
    if (err.message.includes('auth/email-already-in-use')) {
      console.log('User with the same email already exists', 'warning');
      showToastMessage('User with the same email already exists', 'warning');
      console.log(showToastMessage);
    }
    else  {
      showToastMessage(err.message, 'error');
      console.log(showToastMessage);
    }
  }
}


  //   CONFIGURING TOAST TO TOAST MESSAGE
const showToastMessage = (message: any, type: any) => {
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

const SignUpForm = () => {
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
      <Toaster position='top-right' z-index='9999' visibleToasts={2} dir='rtl' theme="light" invert={true} expand={true} richColors closeButton />
      {/* <Toast showToast={showToastMessage} /> */}
    </div>
  )
}

export { createReader, SignUpForm }