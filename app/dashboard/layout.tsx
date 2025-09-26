"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
    
    if (status === "authenticated" && !session?.user?.emailVerified) {
      redirect("/auth/verify-request");
    }
  }, [status, session]);

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(220, 10%, 8%)' }}>Loading...</div>;
  }

  const navigation = [
    { name: "profile", path: "/dashboard/profile" },
    { name: "register", path: "/dashboard/register" },
    { name: "cart", path: "/dashboard/cart" },
    { name: "myevents", path: "/dashboard/myevents" },
    { name: "accommodation", path: "/dashboard/accommodation" },
  ];

  // Add hover effect to navigation items
  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const arrow = link.querySelector('.arrow') as HTMLElement;
        const slash = link.querySelector('.slash') as HTMLElement;
        
        if (arrow) {
          arrow.style.transform = 'rotate(0deg) scale(1, 1)';
        }
        
        if (slash) {
          slash.style.marginRight = '0.4ch';
          slash.style.transform = 'scale(0.5, 0.5) rotate(72deg)';
        }
      });
      
      link.addEventListener('mouseleave', () => {
        const arrow = link.querySelector('.arrow') as HTMLElement;
        const slash = link.querySelector('.slash') as HTMLElement;
        
        if (arrow) {
          arrow.style.transform = 'rotate(-72deg) scale(1, 0)';
        }
        
        if (slash) {
          slash.style.marginRight = '0';
          slash.style.transform = 'scale(1, 1) rotate(0deg)';
        }
      });
    });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      background: 'hsl(220, 10%, 8%)', 
      color: 'hsl(220, 30%, 80%)',
      fontFamily: '\'Space Grotesk Variable\', sans-serif'
    }}>
      <header className="flex justify-between items-center p-4 md:p-6" style={{ 
        height: '5rem',
        borderBottom: '1px solid hsl(220, 10%, 16%)'
      }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="pfp text-2xl flex items-center justify-center" style={{ 
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            background: 'hsl(220, 10%, 16%)',
            transition: 'transform 1.5s',
            color: 'hsl(220, 30%, 80%)'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'rotate(360deg)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'rotate(0deg)';
          }}
          >
            S
          </Link>
          <Link href="/dashboard">
            <h1 className="text-xl md:text-2xl font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>Surge</h1>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          {navigation.map(({ name, path }) => (
            <Link 
              key={path} 
              href={path}
              className="nav text-lg font-mono relative"
              style={{ 
                color: pathname === path ? 'hsl(190, 70%, 50%)' : 'hsl(220, 30%, 80%)',
              }}
            >
              <span className="arrow" style={{
                position: 'absolute',
                top: '-0.02em',
                transform: 'rotate(-72deg) scale(1, 0)',
                transition: '0.3s',
                transformOrigin: '50% 53%',
                color: 'hsl(190, 70%, 50%)'
              }}>-&gt;</span>
              <span className="slash" style={{
                display: 'inline-block',
                transition: '0.3s',
                transform: 'scale(1, 1) rotate(0deg)',
                lineHeight: 0
              }}>/</span>
              {name}
            </Link>
          ))}
        </nav>
      </header>
      
      <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
        {children}
      </main>
      
      <footer className="p-4 text-center text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>
        © {new Date().getFullYear()} Surge - Eklavya
      </footer>
    </div>
  );
}