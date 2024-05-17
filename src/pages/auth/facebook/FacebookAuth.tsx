import { sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, FacebookUser, firestore } from "../../../firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";


export const facebookSignUp = async () => {
  // e.preventDefault();

  try {
    const resp = await signInWithPopup(auth, FacebookUser);
    const user = resp.user;

    await storeUserData(user, 'Facebook')
  }
  catch (err) {
    console.log(err);
  }
}

const storeUserData = async (user: any, provider: string) => {
  try {
    const userDocRef = doc(firestore, 'Reader', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: any;

    if (!userDoc.exists()) {
      const checkEmailExists = await emailExists(user.email);

      if (checkEmailExists) {
        console.log('bhjknmjknbn');
      }

      userData = {
        username: getFirstName(user.displayName),
        email: user.email,
        provider: provider,
      }

      await setDoc(userDocRef, userData);
      await sendEmailVerification(user);
    }
    else if (userDoc.exists()) {
      console.log('Sign Up successful')
    }
  }
  catch (err) {
    console.log('Invalid User')
  }
}


const emailExists = async (email: any) => {
  const userEmail = collection(firestore, 'Reader');
  const emailQuery = query(userEmail, where('email', '==', email));
  const result = await getDocs(emailQuery);
  return !result.empty;
};


const getFirstName = (fullName: string) => {
  const name = fullName.split(' ');
  return name[0];
};

// const FacebookAuth = () => {
//   return (
//     <div>
        
//     </div>
//   )
// }

// export default FacebookAuth

export const facebookauth = () => {
  return (
    <div>

    </div>
  )
}
