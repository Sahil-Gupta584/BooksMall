import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking:true
        }),
        Nodemailer({
            server: {
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS
                },
            },
            from: 'guptas3067@gmail.com',
            generateVerificationToken: async () => {
                return Math.random().toString(36).slice(2);
            },
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
                    token.picture = `https://api.multiavatar.com/${token.name}.svg`; // Default avatar
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
                    // You can add custom logic here to handle email sign-ins
                    // For example, creating or updating user profile in your database
                    const userProfile = await client.db().collection("users").findOneAndUpdate(
                        { email: user.email },
                        {
                            $set: {
                                email: user.email,
                                name: user.email?.split('@')[0], // Default name from email
                                image:`https://api.multiavatar.com/${user.name}.svg`, // Default avatar
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
});