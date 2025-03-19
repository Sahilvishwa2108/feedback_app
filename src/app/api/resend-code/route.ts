import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { generateVerificationCode } from '@/lib/utils';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username } = await request.json();
    
    // Find the user
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return Response.json(
        { success: false, message: 'Your account is already verified' },
        { status: 400 }
      );
    }

    // Generate a new verification code
    const verifyCode = generateVerificationCode(); // Implement this function in your utils
    
    // Set expiry time to 10 minutes from now
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);
    
    // Update user record with new code
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = expiryDate;
    await user.save();
    
    // Send the email with the new code
    await sendVerificationEmail(user.email, user.username, verifyCode);

    return Response.json(
      { 
        success: true, 
        message: 'New verification code has been sent to your email' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resending verification code:', error);
    return Response.json(
      { success: false, message: 'Failed to resend verification code' },
      { status: 500 }
    );
  }
}