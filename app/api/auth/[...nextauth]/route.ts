// [...] forwards all auth requests to this route
// nextauth tells next what api to use
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { sendVerificationRequest } from "@/server/verfiy";

export const authOptions = {
  providers: [
    EmailProvider({
      server: "", // Not needed with Resend, but required by NextAuth
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    // ...other providers
  ],
  // ...other NextAuth options
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
