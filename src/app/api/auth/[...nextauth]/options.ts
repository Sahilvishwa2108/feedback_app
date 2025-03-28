import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Add this import
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions, User } from "next-auth";
import mongoose from 'mongoose'; // Add this import

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
                password: { label: 'Password', type: 'password' },
                autoLogin: { label: 'Auto Login', type: 'text' }
            },
            async authorize(credentials): Promise<User> {
                console.log("Received Credentials:", credentials);
                if (!credentials) {
                    throw new Error("Invalid credentials provided!");
                }

                await dbConnect();
                try {
                    // Check if this is an auto-login request
                    if (credentials.autoLogin === 'true') {
                        console.log("Processing auto-login");
                        
                        // Find user by email
                        const user = await UserModel.findOne({
                            email: credentials.email
                        });
                        
                        if (!user) {
                            throw new Error('User not found');
                        }
                        
                        // Validate the auto-login token
                        if (
                            user.autoLoginToken === credentials.password && 
                            user.autoLoginTokenExpiry && 
                            new Date(user.autoLoginTokenExpiry) > new Date()
                        ) {
                            console.log("Auto-login token validated successfully");
                            
                            // Clear the token after use (security best practice)
                            user.autoLoginToken = '';
                            user.autoLoginTokenExpiry = new Date(0); // Set to epoch time to invalidate
                            await user.save();
                            
                            return user.toObject() as User;
                        } else {
                            throw new Error('Invalid or expired auto-login token');
                        }
                    }
                    
                    // Regular login flow
                    if (!credentials.email || !credentials.password) {
                        throw new Error("Email and password are required");
                    }

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email },
                        ],
                    });
                    
                    // Rest of your existing authorize code...
                    if (!user) {
                        console.log("No user found");
                        throw new Error('No user found with this email!');
                    }
                    
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login');
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
                console.log('🔍 Google OAuth sign-in attempt for:', user.email);
                
                try {
                    await dbConnect();
                    console.log('🔍 MongoDB connection state:', mongoose.connection.readyState);
                    
                    // Check if user already exists in DB by email
                    const existingUser = await UserModel.findOne({ email: user.email });
                    console.log('🔍 Existing user check:', existingUser ? 'Found' : 'Not found');
                    
                    if (!existingUser) {
                        // Generate a unique username based on email
                        const baseUsername = user.email?.split('@')[0] || `user_${Date.now()}`;
                        let username = baseUsername;
                        let counter = 1;
                        
                        // Check if username exists and keep trying until we find a unique one
                        let usernameExists = await UserModel.findOne({ username });
                        while (usernameExists) {
                            console.log(`🔍 Username ${username} already exists, trying another`);
                            username = `${baseUsername}${counter}`;
                            counter++;
                            usernameExists = await UserModel.findOne({ username });
                        }
                        
                        console.log(`✅ Using unique username: ${username}`);
                        
                        // Create a new user document in MongoDB
                        const newUser = new UserModel({
                            email: user.email,
                            username: username, // Now guaranteed to be unique
                            password: await bcrypt.hash(crypto.randomUUID(), 10),
                            verifyCode: "OAUTH",
                            verifyCodeExpiry: new Date(Date.now() + 3600000),
                            isVerified: true,
                            isAcceptingMessages: true,
                            messages: [],
                        });
                        
                        // Log the model before saving for debugging
                        console.log('🔍 About to save new user with data:', {
                            email: newUser.email,
                            username: newUser.username
                        });
                        
                        const savedUser = await newUser.save();
                        console.log(`✅ User saved successfully with ID: ${savedUser._id}`);
                        
                        // Update the user object with the MongoDB _id
                        if (savedUser._id) {
                            user._id = savedUser._id.toString();
                        }
                    } else {
                        console.log(`✅ Using existing user with ID: ${existingUser._id}`);
                        if (existingUser._id) {
                            user._id = existingUser._id.toString();
                        }
                    }
                    return true;
                } catch (error: unknown) {
                    // Enhanced error reporting
                    console.error("❌ Error during OAuth sign in:", error);
                    
                    // Log validation errors specifically
                    if (
                        typeof error === 'object' && 
                        error !== null && 
                        'name' in error && 
                        error.name === 'ValidationError' && 
                        'errors' in error && 
                        error.errors
                    ) {
                        // Use type assertion for the mongoose validation error structure
                        const validationError = error as { errors: Record<string, { message: string }> };
                        Object.keys(validationError.errors).forEach(key => {
                            console.error(`❌ Validation error for '${key}':`, validationError.errors[key].message);
                        });
                    }
                    
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
