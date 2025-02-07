// import { NextResponse } from "next/server";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/ask-question(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   const authObject = await auth();

//   if (isProtectedRoute(req) && !authObject.userId) {
//     const signInUrl = new URL("/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url); // Store original URL in redirect_url param
//     return NextResponse.redirect(signInUrl); // Redirect to sign-in page with original URL as a param
//   }
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define your public and ignored routes
const publicRoutes = [
  "/api/webhook",
  "/",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
];

const ignoredRoutes = ["/api/webhook", "/api/chatgpt"];

// Create route matchers
const isProtectedRoute = createRouteMatcher(["/ask-question(.*)"]);
const isPublicRoute = createRouteMatcher(publicRoutes);
const isIgnoredRoute = createRouteMatcher(ignoredRoutes);

// Unified middleware
export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();

  // Skip ignored routes
  if (isIgnoredRoute(req)) {
    return NextResponse.next();
  }

  // If the route is protected and the user is not authenticated
  if (isProtectedRoute(req) && !authObject.userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url); // Store original URL in redirect_url param
    return NextResponse.redirect(signInUrl); // Redirect to sign-in page with original URL as a param
  }

  // Allow public routes and authenticated access
  if (isPublicRoute(req) || authObject.userId) {
    return NextResponse.next();
  }

  // Default behavior for authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
