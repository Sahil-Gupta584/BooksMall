import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const client = new MongoClient(
  "mongodb+srv://guptas3067:root123@cluster0.6yerxth.mongodb.net/Booksmall"
);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  trustedOrigins: [process.env.FRONTEND_URL!],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "profile", "email"],
    },
  },
  secret: process.env.AUTH_SECRET,
});
