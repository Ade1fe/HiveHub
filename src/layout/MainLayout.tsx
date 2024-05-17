import React, { ReactNode, useState } from 'react'
import { Footer, Navbar } from '../components'


interface MainLayoutProps {
    children: ReactNode;
  }
  

  const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [, setModalType] = useState<'signin' | 'signup' | null>(null);
  
    const toggleModal = (modal: 'signin' | 'signup') => {
      setModalType(modal);
      setIsModalOpen(!isModalOpen);
    };

    

  return (
    <div>
     <Navbar toggleModal={toggleModal} />
     <div >{children} </div>
      <Footer />
    </div>
  )
}

export default MainLayout
