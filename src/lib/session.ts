import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session?.user?.email) {
    return null;
  }

  return session.user;
}
