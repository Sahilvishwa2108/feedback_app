export const runtime = 'nodejs';

import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
): Promise<Response> {
  const messageId = params.messageid;

  // Establish database connection
  await dbConnect();

  // Retrieve session details
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401 }
    );
  }

  try {
    // Remove the message from the user's messages array
    const updateResult = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    // If no document was modified, the message wasn't found or already removed
    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Message not found or already deleted' }),
        { status: 404 }
      );
    }

    // Successfully deleted the message
    return new Response(
      JSON.stringify({ success: true, message: 'Message deleted' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting message' }),
      { status: 500 }
    );
  }
}
