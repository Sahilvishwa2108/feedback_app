import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const maxDuration = 30;

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for a anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        { name, status, headers, message, success: false },
        { status: status || 500 }
      );
    } else {
      console.error("An unexpected error occurred", error);
      // Return a proper JSON response instead of throwing the error
      return NextResponse.json(
        { message: "Failed to generate suggestions", success: false },
        { status: 500 }
      );
    }
  }
}