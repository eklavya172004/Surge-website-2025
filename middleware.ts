import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom logic to check if user is verified
    const token = req.nextauth.token;
    
    // Check if user is verified (has emailVerified timestamp)
    const isVerified = !!token?.emailVerified;
    
    // If user is not verified and trying to access protected routes
    if (!isVerified && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/profile"))) {
      // Redirect to verification page
      const verifyUrl = new URL("/auth/verify-request", req.url);
      if (token?.email) {
        verifyUrl.searchParams.set("email", token.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if user has a valid token
        return !!token;
      },
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // Add any other routes that should be protected
  ],
};