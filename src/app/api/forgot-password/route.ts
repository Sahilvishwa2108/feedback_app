import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import crypto from 'crypto';
import { render } from '@react-email/render';
import PasswordResetEmail from '../../../../emails/PasswordResetEmail';
import transporter from '@/lib/nodemailer';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    
    // Get the origin from request headers or use fallbacks
    const origin = request.headers.get('origin') || 
                  process.env.NEXTAUTH_URL || 
                  process.env.VERCEL_URL || 
                  'http://localhost:3000';
    
    // Check if user exists
    const user = await UserModel.findOne({ email });
    
    // For security reasons, always return a success message even if the email doesn't exist
    if (!user) {
      console.log('Password reset requested for non-existent email:', email);
      return Response.json(
        { 
          success: true, 
          message: 'If your email is in our system, you will receive a password reset link shortly.' 
        },
        { status: 200 }
      );
    }
    
    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiry time to 1 hour from now
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
    
    // Save token to user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Create reset link
    const resetLink = `${origin}/reset-password/${resetToken}`;
    
    // Send email
    const emailHtml = await render(PasswordResetEmail({ 
      username: user.username,
      resetLink 
    }));
    const textContent = `Hi ${user.username},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nIf you didn't request a password reset, please ignore this email.\n\nThis password reset link will expire in 1 hour for security reasons.\n\nMysterious Message Team`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Reset Your Password - Mystery Message',
      html: emailHtml,
      text: textContent,
    });
    
    console.log('Password reset email sent to:', email, info.messageId);

    return Response.json(
      { 
        success: true, 
        message: 'If your email is in our system, you will receive a password reset link shortly.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return Response.json(
      { success: false, message: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}