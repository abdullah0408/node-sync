import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(), // Server-only secrets, never exposed to client
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(), // Public values safe for client
  },
  // Use experimental__runtimeEnv for client-side values that are only available at runtime,
  // e.g., dynamic URLs or keys that are not known at build time.
  // This is needed if your client env vars might change between builds and must be read from process.env at runtime.
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
