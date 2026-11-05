import { clerkMiddleware } from "@clerk/nextjs/server";

// Every route requires a signed-in user (this is an internal tool: no public
// pages). A signed-out page visit is redirected to Clerk's sign-in page and
// comes back after signing in; any other request (page data fetched during
// in-app navigation, server actions) gets a 404.
//
// This must happen here, not only in the root layout: Next.js renders a page
// and sends its data even when the layout does not show it, and on in-app
// navigation the layout is not re-run at all.
export default clerkMiddleware(async (auth) => {
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
