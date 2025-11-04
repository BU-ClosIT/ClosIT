"use client";
import { User } from "@/model/User";
import { createContext, useContext, useEffect, useState } from "react";

type UserContext = User | null;

const UserContext = createContext<UserContext>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserContext>(null);

  useEffect(() => {
    setUser({ id: "sampleUserId" });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
