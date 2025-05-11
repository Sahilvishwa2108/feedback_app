import { render } from '@react-email/render';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import transporter from '@/lib/nodemailer';

/**
 * Sends a verification email with OTP to the specified user
 */
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Validate inputs
  if (!email || !username || !verifyCode) {
    return {
      success: false,
      message: 'Missing required parameters for email verification'
    };
  }

  try {
    // Create and render email content
    const htmlContent = await render(
      VerificationEmail({ 
        username: username, 
        otp: verifyCode 
      })
    );
    
    // Plain text fallback version
    const textContent = `Hello ${username}, your verification code is: ${verifyCode}. If you didn't request this code, you can safely ignore this email.`;

    // Send email via nodemailer
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Anonymous Feedback Verification Code',
      html: htmlContent,
      text: textContent,
    });

    return { 
      success: true, 
      message: 'Verification email sent successfully.', 
      data: { messageId: info.messageId } 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email sending failed:', errorMessage);
    
    return { 
      success: false, 
      message: 'Failed to send verification email', 
      error: errorMessage 
    };
  }
}
