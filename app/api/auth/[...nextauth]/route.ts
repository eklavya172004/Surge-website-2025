// [...] forwards all auth requests to this route
// nextauth tells next what api to use
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/server/auth"; // your existing config

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
