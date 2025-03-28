import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Add this import
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    username: profile.email.split('@')[0], // Generate username from email
                    isVerified: true, // Google accounts are pre-verified
                    isAcceptingMessages: true,
                }
            }
        }),
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
        async signIn({ user, account, profile, email, credentials }) {
            // Only handle Google sign-ins
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    // Check if user already exists in DB by email
                    const existingUser = await UserModel.findOne({ email: user.email });
                    
                    if (!existingUser) {
                        // Create a new user document in MongoDB
                        const newUser = new UserModel({
                            email: user.email,
                            username: user.email?.split('@')[0] || `user_${Date.now()}`,
                            // Since these are OAuth users, we don't need a real password
                            // but the schema requires it, so we set a secure random one
                            password: await bcrypt.hash(crypto.randomUUID(), 10),
                            verifyCode: "OAUTH",
                            verifyCodeExpiry: new Date(Date.now() + 3600000),
                            isVerified: true,
                            isAcceptingMessages: true,
                            messages: [],
                        });
                        
                        const savedUser = await newUser.save();
                        // Update the user object with the MongoDB _id
                        user._id = (savedUser as any)._id.toString();
                    } else {
                        // User exists, use their MongoDB _id
                        user._id = (existingUser as any)._id.toString();
                    }
                    return true;
                } catch (error) {
                    console.error("Error during OAuth sign in:", error);
                    return false;
                }
            }
            return true; // Allow all other sign-ins
        },
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
