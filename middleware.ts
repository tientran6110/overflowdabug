import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ask-question(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();

  if (isProtectedRoute(req) && !authObject.userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url); // Store original URL in redirect_url param
    return NextResponse.redirect(signInUrl); // Redirect to sign-in page with original URL as a param
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
