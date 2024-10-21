import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { dbConnect } from "./mongodb";
import { Users } from "./mongodb/models";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: "credentials",
            name: 'Credentials',
            credentials: {
                name: { label: "Name", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {

                try {

                    const name = credentials?.name;
                    const email = credentials.email;
                    const password = credentials.password;

                    if (!email || !password)
                        return new CredentialsSignin("Please provide both email & password");
                    

                    await dbConnect();
                    const existingUser = await Users.findOne({ email })

                    if (!existingUser) {

                        const avatarUrl = `https://ui-avatars.com/api/?name=${name}&rounded=true`;
                        const newUser = await Users.create({
                            name,
                            email,
                            avatarUrl,
                            password, 
                        });
                        console.log('Registered new User!');
                        
                        return newUser; 
                        
                    } else if (existingUser.password !== password) {
                        throw new CredentialsSignin('Wrong Password!');
                    } else {
                        console.log('user already registered, loggingIn');
                        return existingUser; 
                    }

                } catch (error) {
                    console.log(error, 'err from NextAuth authorize')
                    return new CredentialsSignin(error.message);
                }
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/auth',
    },
    callbacks: {
        signIn: async ({ user, account }) => {

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

            return true
        },

    },


})