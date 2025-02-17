import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(email: string): Promise<ApiResponse> {
    