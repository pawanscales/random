"use client";

import { SessionProvider } from "next-auth/react";

type NextAuthProviderProps = {
  children?: React.ReactNode;
};

const NextAuthProvider = ({ children }: NextAuthProviderProps) => (
  <SessionProvider>{children}</SessionProvider>
);

export default NextAuthProvider;
