"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </TRPCReactProvider>
  );
}
