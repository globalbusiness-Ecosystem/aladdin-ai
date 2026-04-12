import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // التأكد من وجود الـ API Key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // استخدام موديل Gemini 3 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash",
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in Aladdin AI:", error);
    return NextResponse.json({ error: "فشل في الاتصال بعلاء الدين" }, { status: 500 });
  }
}