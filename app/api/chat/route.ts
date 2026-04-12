 
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error: any) {
    console.error('Aladdin AI Error:', error);
    return NextResponse.json(
      { error: 'Connection Failed', details: error.message },
      { status: 500 }
    );
  }
}