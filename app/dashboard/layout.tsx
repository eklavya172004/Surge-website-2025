"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";
import {
  User,
  Calendar,
  ShoppingCart,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Logo from "./../../public/footer/surge-logo.svg";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigationItems = [
    { href: "/dashboard/profile", icon: User, label: "Profile" },
    { href: "/dashboard/register", icon: Calendar, label: "Register for Events" },
    { href: "/dashboard/cart", icon: ShoppingCart, label: "Cart" },
    { href: "/dashboard/myevents", icon: CalendarCheck, label: "Registered Events" },
  ];

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-soft-light opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-soft-light opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 
          bg-gradient-to-b from-indigo-950 to-purple-950 text-white flex flex-col justify-between
          transform transition-all duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="transform transition-transform duration-300 hover:scale-105">
                  <Image src={Logo} width={190} height={60} alt="Surge Logo" />
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white/70 text-sm mt-2 font-light tracking-wide">Dashboard Control Center</p>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-1 flex-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 rounded-xl text-white/80
                    transition-all duration-300 hover:bg-white/10 hover:text-white
                    hover:translate-x-2 hover:shadow-lg
                    border-l-2 border-transparent group-hover:border-indigo-400
                    relative overflow-hidden
                    ${index === 0 ? 'mt-2' : ''}
                  `}
                  style={{
                    transitionDelay: isMounted ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Icon className="h-5 w-5 mr-4 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-300" />
                  <span className="font-medium flex-1 transition-all duration-300">{item.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              );
            })}
          </nav>

          {/* Stats section */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-white font-bold">24</div>
                <div className="text-xs">Events</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-white font-bold">127</div>
                <div className="text-xs">Participants</div>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="p-6 border-t border-white/20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="w-full flex items-center justify-center px-4 py-3 
                bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 
                text-white font-semibold rounded-xl transition-all duration-300
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                group"
            >
              <LogOut className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Surge Dashboard</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 min-h-[600px] relative overflow-hidden shadow-2xl border border-white/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="relative z-10 transition-opacity duration-500">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}