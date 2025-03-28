import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
  };
  autoLogin?: boolean;
  data?: {
    messageId: string;
    [key: string]: any;  // Allow for additional data properties
  };
  error?: string;
  // Add the missing properties that are causing TypeScript errors
  isAcceptingMessages?: boolean;
  messages?: Message[];
};
