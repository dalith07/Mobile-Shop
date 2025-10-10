import { DOMAIN } from "@/lib/constants";
import { ProfileWithUser } from "@/lib/utils";

export async function getUser(
  pageNumber: string | undefined
): Promise<ProfileWithUser> {
  const response = await fetch(`${DOMAIN}/api/dashboard/users/${pageNumber}`, {
    cache: "no-store", // still fine
    credentials: "include", // optional; ensures cookies are forwarded if needed
  });

  if (!response.ok) {
    throw new Error("Failed To Fetch Users");
  }

  const users = await response.json();
  return users;
}
