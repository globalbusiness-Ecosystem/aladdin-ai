import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// السطر ده بيخلي الكود يشتغل بسرعة البرق على Vercel
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // لقط الرسالة مهما كان اسمها في الكود بتاع الصفحة
    const userMessage = body.message || body.prompt;

    if (!userMessage) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Aladdin Error:", error);
    return NextResponse.json({ 
      error: "خطأ في الاتصال", 
      details: error.message 
    }, { status: 500 });
  }
}