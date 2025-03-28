// import { Message } from "@/model/User";

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
};
