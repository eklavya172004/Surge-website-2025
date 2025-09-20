"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return(
         <div className="flex min-h-screen bg-gray-400">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">Surge Dashboard</h2>
          </div>
          <nav className="mt-6 space-y-2">
            <Link href="/dashboard/profile" className="block px-6 py-2 hover:bg-gray-800">
              Profile
            </Link>
            <Link href="/dashboard/myevents" className="block px-6 py-2 hover:bg-gray-800">
              Registered Events
            </Link>
            <Link href="/dashboard/payments" className="block px-6 py-2 hover:bg-gray-800">
              Payment Status
            </Link>
            <Link href="/allevents" target="_blank" className="block px-6 py-2 hover:bg-gray-800">
              Register for More Events
            </Link>
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="px-6 py-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full rounded-md bg-red-600 py-2 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content changes dynamically */}
      <main className="flex-1 p-6">{children}</main>
    </div>
    )
}