import { firestore } from "../../../../firebase";
import { doc, getDoc } from 'firebase/firestore';

// Function to get user data from Firestore
const getUserData = async (userId: string) => {
  try {
    const userDataRef = doc(firestore, 'Reader', userId); // Assuming 'Reader' is the collection where user data is stored
    const userDataSnapshot = await getDoc(userDataRef);
    
    if (userDataSnapshot.exists()) {
      const userData = userDataSnapshot.data();
      return {
        email: userData.email,
        photoURL: userData.photoURL, // Assuming the user's photo URL is stored in 'photoURL' field in Firestore
      };
    } else {
      return null; // User data doesn't exist
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export default getUserData;
