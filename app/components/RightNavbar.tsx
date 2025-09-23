'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RightNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingRight: '50px', position: 'fixed', zIndex: 1001, right: 10, background: 'white', height: '10vh' }}>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }} onClick={() => {}}>
        CONTACT
      </div>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }} onClick={() => {}}>
        FIFA
      </div>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }} onClick={() => {}}>
        SHOP
      </div>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }} onClick={handleLoginClick}>
        LOGIN
      </div>
    </div>
  );
}