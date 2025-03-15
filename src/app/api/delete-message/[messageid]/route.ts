import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import type { NextRequest } from 'next/server';

// Define a custom user type that includes MongoDB _id
interface UserWithId extends User {
  _id: string;
  username?: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } }
) {
  // Get messageid from path parameters, not query parameters
  const messageId = params.messageid;
  
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  // Cast the user to our extended type
  const _user = session?.user as UserWithId | undefined;
  
  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Message not found or already deleted', success: false }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Message deleted', success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ message: 'Error deleting message', success: false }),
      { status: 500 }
    );
  }
}
