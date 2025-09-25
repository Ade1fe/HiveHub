import { createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth"
import { auth, firestore, storage } from "../../../firebase"
import { doc, setDoc, } from "firebase/firestore";
import { useEffect, useState } from "react";
import defaultImageFile from '../../../assets/user.png'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toaster, toast } from "sonner";
// import Toast from "../../../toast/Toast";

const createReader = async (username: string, email: string, password: string, navigate: any) => {
  if (!username.trim() || !email.trim() || !password.trim()) {
    showToastMessage('Please fill in all fields', 'error');
    return;
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  if (!validatePassword(password)) {
    showToastMessage('Password must be at least 8 characters long', 'warning');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const readerId = userCredential.user.uid;

    try {
      const userDocRef = doc(firestore, 'Reader', readerId);

      const response = await fetch(defaultImageFile);
      const defaultImageBlob = await response.blob();

      const defaultImageRef = ref(storage, `userImages/${readerId}/user.png`);
      await uploadBytes(defaultImageRef, defaultImageBlob);

      const userImageUrl = await getDownloadURL(defaultImageRef);

      await setDoc(userDocRef, {
        username: username,
        email: email,
        userImage: userImageUrl,
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(userCredential.user);
      showToastMessage('Sign up successful and email verification sent', 'success');
      navigate('/hive-hub');
    }
    catch (err) {
      await userCredential.user.delete();
      throw err;
    }
  }
  catch (err: any) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        showToastMessage('User with this email already exists', 'warning');
        // ✅ Don't navigate on error
        break;
      case 'auth/weak-password':
        showToastMessage('Password is too weak', 'error');
        break;
      case 'auth/invalid-email':
        showToastMessage('Invalid email format', 'error');
        break;
      default:
        showToastMessage('Sign up failed. Please try again', 'error');
        break;
    }
  }
}


  //   CONFIGURING TOAST TO TOAST MESSAGE
const showToastMessage = (message: string, type: 'success' | 'error' | 'warning') => {
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

export { createReader, SignUpForm }