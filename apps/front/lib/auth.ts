import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [process.env.VITE_FRONTEND_URL!],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "profile", "email"],
    },
  },
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      },
    },
  },
});

export async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URL!);
}
