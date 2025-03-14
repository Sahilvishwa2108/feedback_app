import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials): Promise<User> {
                console.log("Received Credentials:", credentials);
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Invalid credentials provided!");
                }

                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email },
                        ],
                    })
                    if (!user) {
                        console.log("No user found");
                        throw new Error('No user found with this email!')
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }
                    if (!user.password) {
                        throw new Error("User password not found in database");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials?.password || "", user?.password || "")
                    if (isPasswordCorrect) return user.toObject() as User;
                    else {
                        throw new Error('Incorrect Password')
                    }
                } catch (error) {
                    console.error("❌ Login error", error);
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error("An unknown error occurred");
                    }
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in'
    },
}
