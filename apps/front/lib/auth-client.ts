import { createAuthClient } from "better-auth/react";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!backendUrl) throw new Error("Backend url not found");

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  { baseURL: backendUrl, fetchOptions: { credentials: "include" } }
);

export const { useSession } = authClient;
export const signIn: (typeof authClient)["signIn"] = authClient.signIn;
export const signOut: (typeof authClient)["signOut"] = authClient.signOut;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
