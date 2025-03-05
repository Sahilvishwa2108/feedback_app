import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function createUser(username: string, email: string, password: string, verifyCode: number) {
  const hashedPassword = await hashPassword(password);
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    verifyCode,
    verifyCodeExpiry: expiryDate,
    isVerified: false,
    isAcceptingMessages: true,
    messages: [],
  });
  await newUser.save();
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit integer code
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return Response.json(
            {
                success: false,
                message: "Email already exists",
            },
            {
                status: 400,
            }
        );
      } else {
        existingUserByEmail.password = await hashPassword(password);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
        await existingUserByEmail.save();
      }
    } else {
      await createUser(username, email, password, verifyCode);
    }
    const emailResponse = await sendVerificationEmail(
        email, 
        username,
        verifyCode.toString() // Convert to string for email
    );
    if(!emailResponse.success){
        return Response.json(
            {
                success: false,
                message: emailResponse.message
            },
            {
                status: 500
            }
        );
    }
    return Response.json(
        {
            success: true,
            message: "User registered successfully. Please verify your email address."
        },
        {
            status: 201
        }
    );
  } catch (error) {
    console.error("Error in signup route: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
