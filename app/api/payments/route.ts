import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface PaymentRequest {
  userId: string;
  productId: string;
  paymentId: string;
  txid: string;
  amount: number;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    const body: PaymentRequest = await req.json();
    const { userId, productId, paymentId, txid, amount } = body;

    if (!userId || !productId || !paymentId || !txid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: userId, productId, paymentId, txid',
        },
        { status: 400 }
      );
    }

    console.log(`[Payment] Processing payment for user ${userId}, product ${productId}, payment ${paymentId}`);

    // Verify payment on blockchain (optional - depends on your backend)
    const isValid = await verifyPayment(paymentId, txid, amount);
    
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed',
          paymentId,
        },
        { status: 400 }
      );
    }

    // Record payment in your database (pseudo-code)
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await recordPayment({
      orderId,
      userId,
      productId,
      paymentId,
      txid,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    console.log(`[Payment] Payment recorded: ${orderId}`);

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      paymentId,
      orderId,
    });
  } catch (error) {
    console.error('[Payment API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Payment processing failed',
      },
      { status: 500 }
    );
  }
}

async function verifyPayment(
  paymentId: string,
  txid: string,
  amount: number
): Promise<boolean> {
  try {
    // This is where you would verify the payment with Pi Network
    // For now, we'll assume it's valid if we have the txid
    console.log(`[Payment] Verifying txid: ${txid}, amount: ${amount}`);
    
    // In production, you would call Pi Network's API or check the blockchain
    // For development/sandbox, just verify the structure
    if (!txid || txid.length < 10) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Verification Error]:', error);
    return false;
  }
}

async function recordPayment(paymentData: {
  orderId: string;
  userId: string;
  productId: string;
  paymentId: string;
  txid: string;
  amount: number;
  timestamp: string;
  status: string;
}): Promise<void> {
  try {
    // In production, save this to your database
    // For now, we'll just log it
    console.log('[Database] Recording payment:', paymentData);
    
    // Example: Save to Supabase, Neon, or your preferred database
    // await db.payments.create(paymentData);
  } catch (error) {
    console.error('[Database Error]:', error);
    throw error;
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Pi Payment API',
    endpoint: '/api/payments',
    methods: ['POST'],
    documentation: 'https://docs.pi.network',
  });
}
