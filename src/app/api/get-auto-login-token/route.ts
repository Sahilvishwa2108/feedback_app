import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return Response.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store the token in the user document with an expiry time
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        autoLoginToken: token,
        autoLoginTokenExpiry: expiryTime
      },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, token: token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating auto-login token:', error);
    return Response.json(
      { success: false, message: 'Failed to generate token' },
      { status: 500 }
    );
  }
}