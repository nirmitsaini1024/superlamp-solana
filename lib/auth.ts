import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/db/index";
import { oAuthProxy } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Okito",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      walletAddress: {
        type: "string",
        required: false,
      },
      verifiedAt: {
        type: "date", 
        required: false,
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [oAuthProxy()],
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60 // 5 minutes
    },
    updateAge: 24 * 60 * 60,
    expiresIn: 7 * 24 * 60 * 60,
  }
});