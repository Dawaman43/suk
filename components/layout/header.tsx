import { headers } from "next/headers";
import { getSession } from "@/lib/auth-client";
import HeaderClient, { type UserTypes } from "./HeaderClient";

export default async function Header() {
  // Read cookies and fetch session on the server so the header is instantly correct
  const hdrs = await headers();
  const cookie = hdrs.get("cookie") ?? "";
  const session = await getSession({ fetchOptions: { headers: { cookie } } });

  const currentUser = session?.data?.user;
  const user: UserTypes | null = currentUser
    ? {
        id: currentUser.id,
        name: currentUser.name || "User",
        email: currentUser.email,
        photo: currentUser.image ?? "",
      }
    : null;

  return <HeaderClient user={user} />;
}
