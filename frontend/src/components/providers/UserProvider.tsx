"use client";

import { User } from "../../model/User";
import { createContext, useContext, useEffect, useState } from "react";

type UserContext = { user: User | null; isReady: boolean };

const UserContext = createContext<UserContext>({ user: null, isReady: false });

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ideally we would auth user here, use sample user for now
    setUser({ id: "sampleUserId", name: "Sample User" });
    setIsReady(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, isReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext).user;
}

export function useUserReady() {
  return useContext(UserContext).isReady;
}
