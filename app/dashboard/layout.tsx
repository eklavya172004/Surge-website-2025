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
  ArrowLeft,
  Home,
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-76 
          bg-[#172554] text-white flex flex-col justify-between shrink-0 h-full
          transform transition-transform duration-300 ease-in-out shadow-2xl border-r border-blue-900/40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top: Logo + Back to Home + Navigation */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Logo & Close */}
          <div className="px-5 py-5 border-b border-blue-800/60 flex items-center justify-between">
            <Link href="/" className="block transform transition-transform hover:scale-105">
              <Image
                src={Logo}
                width={150}
                height={42}
                alt="Surge Logo"
                className="w-auto h-8"
              />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-blue-200 hover:bg-blue-800/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Back to Home Button */}
          <div className="px-3 pt-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-200 bg-blue-900/40 hover:bg-blue-800 hover:text-white transition-all border border-blue-700/40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Main Website</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3 px-3 space-y-1 overflow-y-auto flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-3.5 py-2.5 rounded-xl text-blue-200
                    transition-all duration-200 hover:bg-blue-600 hover:text-white
                    border-l-2 border-transparent hover:border-white"
                >
                  <Icon className="h-4 w-4 mr-3 transition-colors duration-200 group-hover:text-white shrink-0" />
                  <span className="font-medium flex-1 text-sm">
                    {item.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Fixed Logout Button (Always visible without scroll!) */}
        <div className="p-4 border-t border-blue-800/60 shrink-0 bg-[#0f172a]/40">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
              bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 
              text-white font-semibold rounded-xl transition-all duration-200
              shadow-md hover:shadow-lg text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Independently Scrollable) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#172554] text-white px-4 py-3 shadow-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-base font-bold">Surge Dashboard</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-blue-200 hover:text-white bg-blue-900/60 px-2.5 py-1 rounded-lg border border-blue-700/50"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}