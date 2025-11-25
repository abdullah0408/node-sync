"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as JotaiProvider } from "jotai";
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <JotaiProvider>{children}</JotaiProvider>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
