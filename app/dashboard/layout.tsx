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
    { href: "/dashboard/payments", icon: CreditCard, label: "Payment Status" },
    { href: "/dashboard/payment", icon: Wallet, label: "Make Payment" },
  ];

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[#1B03A3]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 
          bg-[#1B03A3] text-white flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <Image src={Logo} width={190} height={60} alt="Surge Logo" />
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white/70 text-sm mt-2">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group flex items-center px-4 py-3 rounded-xl text-white/80
                    transition-all duration-300 hover:bg-white/10 hover:text-white
                  "
                >
                  <Icon className="h-5 w-5 mr-4 transition-colors group-hover:text-white" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-6 border-t border-white/20">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="
              w-full flex items-center justify-center px-4 py-3 
              bg-white/10 hover:bg-white/20 text-white font-semibold
              rounded-xl transition-all duration-300
            "
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden bg-[#1B03A3] text-white px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold">Surge Dashboard</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 min-h-[600px] relative overflow-hidden shadow-lg">
              <div className="relative z-10">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}