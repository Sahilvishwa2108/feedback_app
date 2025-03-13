import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log('User session:', _user);

  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    // Check if the user exists
    const userExists = await UserModel.findById(userId).exec();
    if (!userExists) {
      console.log('User not found in the database');
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Simplify the aggregation to check if messages exist
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $project: { messages: 1 } },
    ]).exec();

    console.log('User messages:', userMessages);

    if (!userMessages || userMessages.length === 0 || !userMessages[0].messages) {
      return NextResponse.json(
        { message: 'No messages found for user', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { messages: userMessages[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
