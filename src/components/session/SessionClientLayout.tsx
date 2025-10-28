"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const SessionClientLayout = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionClientLayout;