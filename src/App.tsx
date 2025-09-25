
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
//  @ts-ignore
import { ChakraBaseProvider, ChakraProvider } from '@chakra-ui/react';
import { auth, onAuthStateChanged } from './firebase'; 
import router from './Router';
import './index.css';
import theme from './theme/theme';

function App() {
  useEffect(() => {
    // Set up the authentication listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        return user;
      }
      else {
        return null;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'top-right' } }}>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </>
  );
}

export default App;