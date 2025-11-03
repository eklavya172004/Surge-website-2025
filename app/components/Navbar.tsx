'use client'; 
 
import { RefObject } from 'react'; 
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation"; 
import styles from '../styles/Navbar.module.css'; 
import Image from 'next/image'; 
 
interface NavbarProps { 
  logoSmallRef: RefObject<HTMLDivElement | null>; 
} 
 
export default function Navbar({ logoSmallRef }: NavbarProps) { 
  const rulebookUrl = "https://docs.google.com/document/d/1asukNIo8Kfx_qK9IzvarUcNpbX2Wn9TszDawgh17Jh4/preview"; 
  const { data: session } = useSession(); 
  const router = useRouter(); 
   
  const handleRulebookClick = () => { 
    window.open(rulebookUrl, '_blank', 'noopener,noreferrer'); 
  }; 
 
  const handleLoginClick = () => { 
    if (session) { 
      router.push('/dashboard'); 
    } else { 
      router.push('/auth/login'); 
    } 
  }; 

  const handleRegisterClick = () => { 
    router.push('/auth/register'); 
  }; 

  const handleContactClick = () => {
    router.push('/contact');
  }
  
  return ( 
<nav className={styles.nav}> 
  {/* Left nav links */} 
  <ul style={{ position: 'relative', zIndex: 1300 }}> 
    <li>ABOUT</li> 
    <li>HOME</li> 
    <li  
      className={styles.externalLink} 
      onClick={handleRulebookClick} 
    > 
      RULE BOOK 
    </li> 
  </ul> 
 
  {/* Logo section */} 
  <div className={styles.logoPlaceholder} style={{ position: 'relative', zIndex: 1100, display: 'flex', alignItems: 'center', gap: '10px' }}> 
    {/* Small overlay logo */} 
    <div 
      ref={logoSmallRef} 
      id="logo-small" 
      style={{ 
        position: 'relative', 
        width: '200px', 
        height: '50px',
        marginLeft: '40px', 
      }} 
    > 
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 50, 
          width: '50%', 
          height: '100%', 
          backgroundColor: '#1B263B',  
        }} 
      /> 
      <Image 
        src="/Subtract.png" 
        alt="Small logo outline" 
        width={200}
        height={50}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left:0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain', 
          zIndex: 2, 
          pointerEvents: 'none',
        }} 
      /> 
    </div> 
 
    {/* College logo */} 
 
  </div> 
 
  {/* Right nav links */} 
  <ul style={{ position: 'relative', zIndex: 1100, display: 'flex', alignItems: 'center', gap: '1.5rem' }}> 
    
    <li 
      onClick={handleRegisterClick}
      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
    >
      REGISTER
    </li>
    <li className="hidden md:block cursor-pointer w-fit" onClick={handleContactClick}>CONTACT</li>
    <li onClick={handleLoginClick} style={{ cursor: 'pointer',width:'fit-content' }}>LOGIN</li> 
  </ul> 
</nav> 
 
  ); 
}