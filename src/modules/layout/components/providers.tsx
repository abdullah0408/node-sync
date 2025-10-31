"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
