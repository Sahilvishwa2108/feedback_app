import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { url } from "inspector";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string,
): Promise<ApiResponse> {
	try {
        await resend.emails.send({
            from: "you@example.com",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({username, otp: verifycode}),
        });
        return ({success: true, message: "Verification email sent"});
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {success: false, message: "Error sending verification email"};
    }
}
    