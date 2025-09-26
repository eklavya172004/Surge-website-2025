import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./layout";

export default async function DashboardPage({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth/login");
  }

  // Redirect to verification page if not verified
  if (!session.user.emailVerified) {
    redirect("/auth/verify-request");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}