import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "./lib/db";


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Nodemailer({
            server: {
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // use SSL for port 465
                auth: {
                    user: process.env.Nodemailer_USER,
                    pass: process.env.Nodemailer_PASS
                },
            },
            from: 'guptas3067@gmail.com',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // console.log({ 'token':token, 'user':user, 'trigger':trigger, 'session':session });

            // Initial sign in
            if (user) {
                token.sub = user.id;
                token.email = user.email;

                // For email users, set default values if they don't exist
                if (!token.picture) {
                    token.picture = `https://api.multiavatar.com/${user.name}.svg`; // Default avatar
                }
                if (!token.name) {
                    token.name = user.email?.split('@')[0]; // Use part of email as name
                }
            }

            if (trigger === "update" && session) {
                token.name = session.name;
                token.picture = session.picture;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },
        async signIn({ user, account }) {
            try {
                if (account?.provider === "nodemailer") {
                    const userProfile = await client.db().collection("users").findOneAndUpdate(
                        { email: user.email },
                        {
                            $set: {
                                email: user.email,
                                name: user.email?.split('@')[0], // Default name from email
                                image: `https://api.multiavatar.com/${user.name}.svg`, // Default avatar
                                updatedAt: new Date(),
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                            }
                        },
                        {
                            upsert: true,
                            returnDocument: "after"
                        }
                    );

                    if (userProfile && userProfile.value) {
                        user.name = userProfile.value.name;
                        user.image = userProfile.value.image;
                    }
                }
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },

    },


})