import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // نداء المفتاح من Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // استخدام الموديل المستقر
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash", 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Aladdin Error:", error);
    return NextResponse.json({ error: "Connection Error", details: error.message }, { status: 500 });
  }
}