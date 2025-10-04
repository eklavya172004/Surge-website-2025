"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ReactNode, useState } from "react";
import {
  User,
  Calendar,
  ShoppingCart,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import Logo from "./../../public/footer/surge-logo.svg";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { href: "/dashboard/profile", icon: User, label: "Profile" },
    { href: "/dashboard/register", icon: Calendar, label: "Register for Events" },
    { href: "/dashboard/cart", icon: ShoppingCart, label: "Cart" },
    { href: "/dashboard/myevents", icon: CalendarCheck, label: "Registered Events" },
    { href: "/dashboard/payment", icon: CreditCard, label: "Payment" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-60000 via-[#93c5fd] to-[#1E3A8A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-80 
          bg-[#1E3A8A] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src={Logo}
                      width={160}
                      height={50}
                      alt="Surge Logo"
                      className="sm:w-[180px] lg:w-[190px]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-[#60A5FA] transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4 sm:mt-6 px-3 sm:px-4 space-y-1 flex-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="group flex items-center px-3 sm:px-4 py-3 rounded-lg text-[#BFDBFE]
                      transition-all duration-200 hover:bg-[#60A5FA] hover:text-white
                      border-l-2 border-transparent hover:border-[#BFDBFE]"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3 sm:mr-4 transition-colors duration-200 group-hover:text-white" />
                    <span className="font-medium flex-1 text-sm sm:text-base">
                      {item.label}
                    </span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout button */}
          <div className="p-3 sm:p-4 lg:p-6 border-t border-white">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 
                bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] 
                text-white font-semibold rounded-lg transition-all duration-200
                shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white text-[#1E3A8A] px-3 sm:px-4 py-3 sm:py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[#60A5FA] transition-colors duration-200"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                Dashboard
              </h1>
            </div>
            <div className="w-8 sm:w-10" />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 md:p-6  lg:p-8 overflow-auto flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white md:rounded-2xl p-6 sm:p-8 min-h-[500px] relative overflow-hidden shadow-2xl border border-white/20">
              <div className="relative z-10 transition-opacity duration-500">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}