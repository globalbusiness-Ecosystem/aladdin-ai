import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { paymentId } = await req.json();
  
  const res = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
  return NextResponse.json({ approved: true, data });
}
