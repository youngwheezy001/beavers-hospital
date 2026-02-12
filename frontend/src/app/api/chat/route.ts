import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the AI with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Use the latest 2.5 Flash model for speed
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Set the "Medical Personality" for Beavers FamilyCare
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the Beavers FamilyCare assistant. You are helpful and friendly. If someone asks for medical advice, always suggest they book an appointment with our doctors." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI is currently resting." }, { status: 500 });
  }
}