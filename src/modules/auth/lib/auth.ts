import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { polarClient } from "@/lib/polar";
import { checkout, polar, portal } from "@polar-sh/better-auth";

/**
 * Better Auth configuration for this Next.js app.
 * For more options and setup guide, see: https://www.better-auth.com/docs/introduction
 * & https://www.better-auth.com/docs/integrations/next
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  /**
   * To enable social login (e.g., GitHub, Google):
   * - You must set the corresponding CLIENT_ID and CLIENT_SECRET in your environment (.env),
   *   as shown in .env.example.
   * - If you do not want to use a particular provider, it is recommended to comment out that provider.
   * - For more social OAuth providers and advanced authentication options, see:
   *   https://www.better-auth.com/docs/introduction
   *   & https://www.better-auth.com/docs/integrations/next
   */
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: env.POLAR_PRODUCT_ID,
              slug: env.POLAR_PRODUCT_SLUG,
            },
          ],
          successUrl: env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
