# Aladdin Pi Payments - Quick Reference

## Components

### PaymentButton
```tsx
import { PaymentButton } from '@/components/payment-button';

<PaymentButton
  productId="premium_membership"
  productName="Premium Membership"
  price={9.99}
  onSuccess={(result) => console.log('Success!', result)}
  onError={(error) => console.error('Error', error)}
  size="lg"
/>
```

**Props:**
- `productId`: string (product slug)
- `productName`: string (display name)
- `price`: number (in Pi)
- `onSuccess`: function
- `onError`: function
- `size`: 'sm' | 'md' | 'lg'
- `currency`: string (default: 'Pi')
- `className`: string (Tailwind)

---

### PaymentSheet
```tsx
import { PaymentSheet } from '@/components/payment-sheet';

<PaymentSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  offers={[...]}
/>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `offers`: PaymentOffer[] (optional, uses defaults)

---

### PaymentStatus
```tsx
import { PaymentStatus } from '@/components/payment-status';

<PaymentStatus /> // Shows all active purchases
```

---

### Notifications
```tsx
import {
  PaymentNotification,
  PaymentErrorNotification,
} from '@/components/payment-status';

<PaymentNotification
  productName="Premium Membership"
  amount={9.99}
  onClose={() => {}}
/>

<PaymentErrorNotification
  error="Payment processing failed"
  onClose={() => {}}
/>
```

---

## Hooks

### usePurchaseManager
```tsx
import { usePurchaseManager } from '@/lib/purchase-manager';

const {
  purchases,           // Array of PurchaseItem[]
  isLoading,          // boolean
  error,              // Error | null
  restorePurchases,   // () => Promise<PurchaseItem[]>
  getPurchaseBalance, // (productId: string) => number
  hasPurchased,       // (productId: string) => boolean
  consumePurchase,    // (productId: string, qty?: number) => Promise
  recordPurchaseInMemory, // (id, name, price) => Promise
} = usePurchaseManager({ autoRestore: true });
```

---

### usePurchase
```tsx
import { usePurchase } from '@/lib/pi-payment';

const { makePurchase } = usePurchase();
const result = await makePurchase('product_id');
// result.ok, result.productId, result.paymentId, result.txid
```

---

### useUserState
```tsx
import { useUserState } from '@/lib/pi-payment';

const {
  get,      // (key: string) => Promise<record | null>
  set,      // (key: string, blob: object) => Promise<void>
  purchases,  // () => Promise<{ purchases: [] }>
  consume,  // (productId: string, qty?: number) => Promise
  restore,  // (options?: {}) => Promise<{ purchases: [] }>
} = useUserState();
```

---

## Products Defined

```typescript
// Premium
PREMIUM_MEMBERSHIP (9.99 Pi)
PLATINUM_PLUS (19.99 Pi)

// Real Estate
PROPERTY_LISTING (2.99 Pi)
FEATURED_LISTING (4.99 Pi)

// Automotive
VEHICLE_LISTING (1.99 Pi)
VEHICLE_VERIFICATION (2.49 Pi)

// Education
COURSE_ACCESS (3.99 Pi)
CERTIFICATION (5.99 Pi)

// Commerce
BULK_DISCOUNT_PACK (6.99 Pi)
SHOP_FEATURED (7.99 Pi)

// Support
PRIORITY_SUPPORT (4.99 Pi)
EXPERT_CONSULTATION (8.99 Pi)
```

---

## Error Codes

```typescript
// SDKLiteError codes:
'product_not_found'     // Product doesn't exist in App Studio
'purchase_cancelled'    // User dismissed payment UI
'purchase_error'        // Generic payment failure
```

---

## Configuration

File: `/lib/system-config.ts`

```typescript
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  SANDBOX: false, // Set true for development
};
```

---

## Full Payment Example

```tsx
'use client';

import { useState } from 'react';
import { PaymentButton } from '@/components/payment-button';
import { PaymentStatus } from '@/components/payment-status';
import { usePurchaseManager } from '@/lib/purchase-manager';

export function Shop() {
  const { recordPurchaseInMemory, hasPurchased } = usePurchaseManager();
  const [notification, setNotification] = useState(null);

  const handleSuccess = async (result: any) => {
    await recordPurchaseInMemory(
      'premium_membership',
      'Premium Membership',
      9.99
    );
    setNotification({
      type: 'success',
      message: 'Purchase successful!',
    });
  };

  return (
    <div className="space-y-4">
      <PaymentStatus />

      {!hasPurchased('premium_membership') && (
        <PaymentButton
          productId="premium_membership"
          productName="Premium Membership"
          price={9.99}
          onSuccess={handleSuccess}
          size="lg"
        />
      )}

      {hasPurchased('premium_membership') && (
        <div className="text-green-500">✓ Premium active</div>
      )}
    </div>
  );
}
```

---

## API Endpoints

### POST /api/payments
Records payment confirmation.

**Request:**
```json
{
  "userId": "user123",
  "productId": "premium_membership",
  "paymentId": "payment_abc123",
  "txid": "0x...",
  "amount": 9.99
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "paymentId": "payment_abc123",
  "orderId": "ORDER-1718..."
}
```

---

## Files

```
Key Files:
- /lib/product-config.ts          (Product definitions)
- /lib/pi-payment.ts              (SDKLite hooks)
- /lib/purchase-manager.ts        (Purchase tracking)
- /components/payment-button.tsx  (Buy button)
- /components/payment-sheet.tsx   (Shop modal)
- /components/payment-status.tsx  (Status display)
- /app/api/payments/route.ts      (Callback handler)

Docs:
- /ALADDIN_PAYMENTS_SETUP.md      (Full guide)
- /lib/PAYMENT_USAGE.md           (SDKLite docs)
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Pi Unavailable" | Open in Pi Browser |
| Payment hangs | Check console, clear cache |
| Balance wrong | Call `restorePurchases()` |
| Product not found | Verify ID in `product-config.ts` |
| No UI shown | Ensure user authenticated |

---

## Testing

1. Open app in Pi Browser
2. Click "Premium" in navigation
3. Select product
4. Click "Buy"
5. Approve payment
6. Check payment status display

---

**Last Updated**: June 8, 2026
**Status**: Production Ready
