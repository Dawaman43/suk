"use client";
import { getSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

type User = {
  id?: string | number;
  name: string;
  email?: string | null;
  photo?: string;
};

const MyProductPage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      const u = session.data?.user;
      setUser({
        id: u?.id,
        name: u?.name || "User",
        email: u?.email ?? null,
        photo: u?.image ?? "",
      });
    };

    fetchUser();
  }, []);

  return <div>my product page</div>;
};

export default MyProductPage;
