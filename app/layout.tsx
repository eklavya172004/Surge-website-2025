import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextAuthSessionProvider } from "@/components/session-provider";
import TRPCProvider from "./components/TRPCProvider";
import LoaderWrapper from "./components/LoaderWrapper";
// import LoaderWrapper from "@/components/LoaderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Surge 2026 - The Home of Champions | SNIoE Sports Fest",
  description: "Surge 2026 is the premier annual 3-day sports fest of Shiv Nadar Institution of Eminence (SNIoE). Register college teams for athletics, basketball, football, cricket, and more.",
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
          <TRPCProvider>
            <LoaderWrapper>{children}</LoaderWrapper>
          </TRPCProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
