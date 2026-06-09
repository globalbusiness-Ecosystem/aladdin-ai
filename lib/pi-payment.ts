"use client";

export function usePurchase() {
  const makePurchase = async (productId: string, amount: number, memo: string) => {
    if (typeof window === "undefined" || !window.Pi) {
      throw Object.assign(new Error("Pi Network not available"), { code: "pi_unavailable" });
    }

    return new Promise((resolve, reject) => {
      window.Pi.createPayment(
        { amount, memo, metadata: { productId } },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            resolve({ ok: true, paymentId, txid });
          },
          onCancel: (paymentId: string) => {
            reject(Object.assign(new Error("Cancelled"), { code: "purchase_cancelled" }));
          },
          onError: (error: any) => {
            reject(Object.assign(new Error("Payment error"), { code: "purchase_error" }));
          },
        }
      );
    });
  };

  return { makePurchase };
}
