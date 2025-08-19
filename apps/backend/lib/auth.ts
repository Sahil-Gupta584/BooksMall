import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSession = async (req: any) => {
  return {
    user: { id: "123", name: "John Doe" },
    session: { id: "session123" },
  };
};
export const auth = {
  api: {
    getSession: getSession,
  },
};

const session = await auth.api.getSession({});
export { db, session };
// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   trustedOrigins: [process.env.NEXT_PUBLIC_FRONTEND_URL!],
//   advanced: {
//     defaultCookieAttributes: {
//       sameSite: "none",
//       secure: true,
//     },
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       scope: ["openid", "profile", "email"],
//     },
//   },
//   secret: process.env.AUTH_SECRET,
//   cookies: {
//     sessionToken: {
//       name: "better-auth.session_token",
//       options: {
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//         path: "/",
//       },
//     },
//   },
// });
