"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ReactNode, useState } from "react";
import { 
  User, 
  Calendar, 
  ShoppingCart, 
  CalendarCheck, 
  CreditCard, 
  Wallet,
  LogOut,
  Menu,
  X,
  Zap,
  Home,
} from "lucide-react";
import Image from "next/image";
import Logo from './../../public/SurgeLogo.png';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { href: "/dashboard/profile", icon: User, label: "Profile", color: "hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20" },
    { href: "/dashboard/register", icon: Calendar, label: "Register for Events", color: "hover:bg-gradient-to-r hover:from-orange-600/20 hover:to-red-600/20" },
    { href: "/dashboard/cart", icon: ShoppingCart, label: "Cart", color: "hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20" },
    { href: "/dashboard/myevents", icon: CalendarCheck, label: "Registered Events", color: "hover:bg-gradient-to-r hover:from-cyan-600/20 hover:to-blue-600/20" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 
        bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl
        border-r border-white/10 text-white flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Image src={Logo} width={40} height={40} alt="Surge Logo" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Surge
                </h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`
                    group flex items-center px-4 py-3 rounded-xl text-gray-300
                    transition-all duration-200 transform hover:scale-105
                    ${item.color} hover:text-white hover:shadow-lg hover:shadow-purple-500/25
                  `}
                >
                  <Icon className="h-5 w-5 mr-4 transition-colors group-hover:text-white" />
                  <span className="font-medium">{item.label}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="
              w-full flex items-center justify-center px-4 py-3 
              bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700
              rounded-xl text-white font-semibold
              transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25
              border border-red-500/20
            "
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Surge Dashboard
              </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="
              bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10
              shadow-2xl shadow-purple-500/10 p-8
              min-h-[600px]
            ">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
