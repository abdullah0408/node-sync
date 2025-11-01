import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";
import { polarClient } from "@polar-sh/better-auth";

/**
 * Better Auth client for React (frontend).
 *
 * Configures the base URL for API requests and adds plugins for authentication.
 * - `nextCookies()` handles auth cookies in Next.js.
 *   Make sure `nextCookies()` is the **last plugin** in the plugins array.
 *
 * For more configuration options and plugin details, see:
 * https://www.better-auth.com/docs/introduction
 * & https://www.better-auth.com/docs/integrations/next
 */
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [polarClient(), nextCookies()], // make sure this is the last plugin in the array
});
