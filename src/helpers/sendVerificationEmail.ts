import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string,
): Promise<ApiResponse> {
  try {
    console.log(`Sending verification email to ${email} with code ${verifycode}`);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp: verifycode }),
    });
    console.log("Verification email sent successfully");
    return { success: true, message: "Verification email sent" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}
