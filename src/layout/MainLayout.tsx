import React, { ReactNode, useState } from 'react'
import { CustomModal, Footer, Navbar } from '../components'
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { facebookSignUp } from '../pages/auth/facebook/FacebookAuth';
import { googleSignUp } from '../pages/auth/google/GoogleAuth';
import { createReader } from '../pages/auth/signup/SignUpForm';
import { readReader } from '../pages/auth/signin/SignInForm';
import { Toaster } from "sonner";


interface MainLayoutProps {
    children: ReactNode;
  }
  

  const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // // @ts-ignore
    // const [modalType, setModalType] = useState<'signin' | 'signup' | null>(null);
  
    // const toggleModal = (modal: 'signin' | 'signup') => {
    //   setModalType(modal);
    //   setIsModalOpen(!isModalOpen);
    // };

    const [isModalOpen, setIsModalOpen] = useState(false);
    // @ts-ignore
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [showEmailSignUp, setShowEmailSignUp] = useState(false);
    const [modalContext, setModalContext] = useState("");

    const toggleModal = (configType: string) => {
      if (configType === 'signin') {
        setIsSignInOpen(true);
        setIsModalOpen(true);
        setModalContext('signin');
        setShowEmailSignUp(false);
      } else if (configType === 'signup') {
        setIsSignInOpen(false);
        setIsModalOpen(true);
        setModalContext('signup');
        setShowEmailSignUp(false);
      } else if (configType === 'emailSignUp') {
        setIsSignInOpen(false);
        setIsModalOpen(true);
        // setModalContext('emailSignUp');
        setShowEmailSignUp(true);
      }
    };




    const emailConfig = {
      // title: {modalContext === 'signin' ? 'Sign in with Email' : ''},
      getSubtitleAndContext: (modalConfig: any) => {
        const { subtitleText, modalContext } = getEmailSubtitleAndContext(modalConfig);
        subtitleText: subtitleText;
        modalContext: modalContext;
        return { subtitleText, modalContext };
      },
    };
  
    // console.log(isSignInOpen);
  
    
    const getEmailSubtitleAndContext = (modalConfig: any) => {
      // console.log("Modal Config in getSubtitleAndContext:", modalConfig);
        let subtitleText = '';
        let modalContext = '';
  
        switch (modalConfig) {
          case signInConfig:
            subtitleText = 'Enter the email address and password associated with your account';
            modalContext = 'All sign in options';
            break;
          case signUpConfig:
            subtitleText = 'Enter your email address to create an account.';
            modalContext = 'All sign up options';
            break;
          default:
            // Default values or error handling
            subtitleText = '';
            modalContext = '';
            break;
        }
  
        return { subtitleText, modalContext };
    }
  
    const emailSignUp = () => {
      toggleModal('emailSignUp')
      // setShowEmailSignUp(true);
      // console.log(emailConfig);
    }
  
    const signUpConfig = {
      title: 'Come aboard Hivehub',
      buttons: [
        { onClick: googleSignUp, icon: <FcGoogle className='google' />, text: 'Google', setAuthMethod: 'google', },
        { onClick: facebookSignUp, icon: <BsFacebook className='facebook' />, text: 'Facebook', setAuthMethod: 'facebook', },
        { onClick: emailSignUp, icon: <HiOutlineMail className='email' />, text: 'Email', },
      ],
      texts: [
        { content: 'Already have an account? <span style="color: blue; font-weight: bold; cursor: pointer;">Sign in</span>', textStyles: { fontSize: '16px' }, configType: 'signin' },
        { content: 'Click “Sign up” to agree to Hivehub’s <span style="text-decoration: underline; cursor: pointer; ">Terms of Service</span> and acknowledge that Hivehub <span style="text-decoration: underline; cursor: pointer; ">Privacy Policy</span> applies to you.', textStyles: { padding: '8px 5px', marginTop: '20px', width: '90% 70% ', fontSize: '10px 14px' } },
      ]
    }
  
    const signInConfig = {
      title: 'Welcome back.',
      buttons: [
        { onClick: googleSignUp, icon: <FcGoogle className='google' />, text: 'Google', setAuthMethod: 'google', },
        { onClick: facebookSignUp, icon: <BsFacebook className='facebook' />, text: 'Facebook', setAuthMethod: 'facebook', },
        { onClick: emailSignUp, icon: <HiOutlineMail className='email' />, text: 'Email', },
      ],
      texts: [
        { content: 'No account? <span style="color: green; font-weight: bold; cursor: pointer;">Create one</span>', textStyles: { fontSize: '16px' }, configType: 'signup' },
        { content: 'Click “Sign up” to agree to Hivehub’s <span style="text-decoration: underline; cursor: pointer; ">Terms of Service</span> and acknowledge that Hivehub <span style="text-decoration: underline; cursor: pointer; ">Privacy Policy</span> applies to you.', textStyles: { padding: '8px 5px', marginTop: '20px', width: '90% 70% ', fontSize: '10px 14px' } },
      ]
    }
  
    const { subtitleText } = getEmailSubtitleAndContext(modalContext === "signin" ? signInConfig : modalContext === "signup" ? signUpConfig : emailConfig);

    

  return (
    <div>
     <Navbar toggleModal={toggleModal} />
     {/* <Header toggleModal={toggleModal} /> */}
     <div >{children} </div>

     <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} modalConfig={modalContext === "signin" ? signInConfig : modalContext === "signup" ? signUpConfig : emailConfig} toggleModal={toggleModal} facebookSignUp={facebookSignUp} googleSignUp={googleSignUp} showEmailSignUp={showEmailSignUp} emailConfig={emailConfig} modalContext={modalContext} subtitleText={subtitleText} createReader={createReader} readReader={readReader} />
      <Footer />

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
  )
}

export default MainLayout
