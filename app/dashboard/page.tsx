import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth/login");
  }

  // Redirect to verification page if not verified
  if (!session.user.emailVerified) {
    redirect("/auth/verify-request");
  }

  // Pass session data to client component if needed
  redirect("/dashboard/profile");
}