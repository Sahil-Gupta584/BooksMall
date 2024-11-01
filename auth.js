import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { dbConnect } from "./mongodb";
import { Users } from "./mongodb/models";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Nodemailer({
            server: {
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // use SSL for port 465
                auth: {
                    user: 'guptas3067@gmail.com',
                    pass: 'gwfcskamejdavdbd'
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
        signIn: async ({ user, account, }) => {
            console.log('AuthProvider:', account.provider);

            if (account?.provider === "google") {
                console.log('user from account', account)
                console.log('user from Google', user)
                try {
                    await dbConnect();
                    const { email, name, image, id } = user
                    const existingUser = await Users.findOne({
                        email
                    });

                    if (existingUser) {

                        console.log('existingUser:', existingUser);
                        return true
                    } else {

                        const newUser = await Users.create({
                            data: {
                                name,
                                email,
                                googleId: id,
                            }
                        });
                        console.log('newUser:', newUser);

                        return true
                    }
                } catch (error) {
                    console.log(error, 'err while Signing in user by ', account?.provider)
                    return new CredentialsSignin("err while creating user");
                }
            }

            if (account.provider === 'credentials') {
                console.log('user from account', account)
                console.log('user from credentials', user)
                return true
            }
            if (account.provider === 'nodemailer') {
                console.log('user from account', account)
                console.log('user from resend', user)
                return true
            }
        },

    },


})