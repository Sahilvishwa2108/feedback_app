import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, password } = await request.json();
    
    // Find user with this token and check if token is not expired
    const user = await UserModel.findOne({ 
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return Response.json(
        { success: false, message: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetToken = '';
    user.resetTokenExpiry = new Date(0); // Set to epoch time instead of null
    await user.save();
    
    console.log('Password reset successful for user:', user.email);

    return Response.json(
      { success: true, message: 'Your password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return Response.json(
      { success: false, message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}