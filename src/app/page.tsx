// Add logic to redirect user to login or dashboard based on session
// Replace contents of app/page.tsx (start point)

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  } else {
    redirect('/dashboard');
  }
  return null;
}

// This ensures that when the app loads:
// - If user is not logged in, redirect to login
// - If user is logged in, redirect to /dashboard