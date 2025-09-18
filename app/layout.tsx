import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextAuthSessionProvider } from "@/components/session-provider";
import TRPCProvider from "./components/TRPCProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Surge - Authentication System",
  description: "A Next.js application with verification-based authentication",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <NextAuthSessionProvider session={session}>
          <TRPCProvider>{children}</TRPCProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}