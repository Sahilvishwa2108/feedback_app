import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                        { username: credentials.identifier },
                        { email: credentials.identifier },    
                        ],
                    });
                    if (!user) {
                        console.log("No user found");
                        throw new Error("No user found");
                    }
                    if (!user.isVerified) {
                        console.log("User not verified");
                        throw new Error("User not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        console.log("Password incorrect");
                        throw new Error("Password incorrect");
                    }
                    console.log("User authenticated successfully");
                    return user;
                } catch (error: any) {
                    console.error("Error in authorize function:", error);
                    throw new Error(error);
                }
            },
        }), 
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) { 
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",    
    },
    secret: process.env.NEXTAUTH_SECRET,
};