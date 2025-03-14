// import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { toast } from 'sonner'

import { NextAuthOptions, User } from "next-auth";


// sign in 
export const authOptions:NextAuthOptions = {
    // NextAuthOptions --> TypeScript type provided by next-auth that ensures type safety when configuring authentication in Next.js.
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text'},
                password: { label: 'Password', type: 'password'}
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
                            {email: credentials.email},
                            {username: credentials.email},
                        ],
                    })
                    if(!user) {
                        console.log("No user found");
                        throw new Error('No user found with this email!')
                    }
                    if(!user.isVerified){ 
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
                    console.error("❌ Login error", error); // Log the actual error
                    if (error instanceof Error) {
                        throw new Error(error.message); // Access message safely
                    } else {
                        throw new Error("An unknown error occurred"); // Fallback for unknown errors
                    }
                }
                
            }
        })
    ],
    callbacks: {
        //  session ko nahi pta user obj bhi aa skta hau kyuki next-auth se lere hain to define krdnge nest-auth.d.ts mai
        async jwt({ token, user}) {
            if(user) { // adding to user payload, jaha jaha token ka access hoga wha se yeh sari values nikal lenge, we can also give thse values in sessions
                token._id = user._id?.toString()
                // token._id = user._id
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token;
        },
        async session({ session, token}) {   
            if(token) {
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
        signIn: '/sign-in'  //NextAuth automatically provides authentication routes for us, By default, NextAuth provides built-in authentication pages. Sign-in page: /api/auth/signin
    },
}

// export default NextAuth(authOptions);
