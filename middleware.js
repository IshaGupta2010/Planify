import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, redirectToSignIn } = auth();

  if (!userId && isProtectedRoute(req.nextUrl.pathname)) {
    return redirectToSignIn();
  }

  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next/|.*\\..*).*)", // More robust exclusion of static files and _next
    "/(api|trpc)(.*)",
  ],
};
