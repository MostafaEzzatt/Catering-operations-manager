import { auth, currentUser } from "@clerk/nextjs/server";

// Reads the role from the session token when the Clerk dashboard has
// "metadata" added to the session claims; otherwise falls back to fetching
// the user so the app works (slower) even without that dashboard step.
export async function getSession() {
  const { isAuthenticated, sessionClaims, userId } = await auth();

  if (!isAuthenticated) {
    return { isAuthenticated: false, isAdmin: false, userId: null };
  }

  let role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (role === undefined) {
    const user = await currentUser();
    role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  }

  return { isAuthenticated: true, isAdmin: role === "admin", userId };
}
