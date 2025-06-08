import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  { baseURL: import.meta.env.VITE_BACKEND_URL }
);

export const { useSession } = authClient;
export const signIn: (typeof authClient)["signIn"] = authClient.signIn;
export const signOut: (typeof authClient)["signOut"] = authClient.signOut;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
