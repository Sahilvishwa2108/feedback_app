import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: Record<string, any>; // Add this line to support data property
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};
