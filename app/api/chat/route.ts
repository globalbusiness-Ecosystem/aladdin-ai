import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.prompt;

    const apiKey = process.env.GEMINI_API_KEY;

    // حركة ذكية: لو المفتاح مش موجود، الكود هيرد عليك ويقولك "المفتاح ضايع"
    if (!apiKey) {
      return NextResponse.json({ error: "System Error: API Key is not defined in Vercel settings" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ error: "Connection error", details: error.message }, { status: 500 });
  }
}