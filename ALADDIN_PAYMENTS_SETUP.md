# Aladdin Pi Payments Implementation Guide

## Overview

Aladdin now has full Pi Network payment integration powered by **SDKLite**. Users can purchase premium features, listings, and services directly within the app using Pi cryptocurrency.

---

## Quick Start

### 1. Product Setup

Products are defined in `/lib/product-config.ts`:

```typescript
export const PRODUCT_CONFIG = {
  PREMIUM_MEMBERSHIP: {
    id: "premium_membership",
    name: "Premium Membership",
    description: "Unlock all features for 30 days",
    price: 9.99,
    currency: "Pi",
  },
  // ... more products
};
```

Each product needs:
- `id`: Unique product slug (must match App Studio)
- `name`: Display name
- `description`: Short description
- `price`: Price in Pi
- `currency`: Always "Pi"

### 2. Adding Payment Buttons

Use the `PaymentButton` component anywhere you want to accept payments:

```tsx
import { PaymentButton } from '@/components/payment-button';

function YourComponent() {
  return (
    <PaymentButton
      productId="premium_membership"
      productName="Premium Membership"
      price={9.99}
      onSuccess={(result) => {
        console.log('Purchase successful:', result);
        // Handle success - grant access, update UI, etc.
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
      size="lg"
    />
  );
}
```

**Props:**
- `productId` (string, required): Product slug from App Studio
- `productName` (string, required): Display name
- `price` (number, required): Price in Pi
- `currency` (string): Default "Pi"
- `onSuccess` (function): Called when purchase succeeds
- `onError` (function): Called when purchase fails
- `size` ('sm' | 'md' | 'lg'): Button size
- `className` (string): Tailwind classes

### 3. Payment Modal/Sheet

Display multiple products in a sheet:

```tsx
import { PaymentSheet } from '@/components/payment-sheet';
import { useState } from 'react';

function Shop() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Shop
      </button>
      
      <PaymentSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        offers={[
          {
            category: 'Premium',
            title: 'Premium Membership',
            description: 'Unlock all features',
            productId: 'premium_membership',
            price: 9.99,
            features: ['Unlimited listings', 'Priority support'],
            highlight: true,
          },
        ]}
      />
    </>
  );
}
```

---

## Managing Purchases

### Track Purchase Balances

```typescript
import { usePurchaseManager } from '@/lib/purchase-manager';

function MyApp() {
  const { purchases, hasPurchased, getPurchaseBalance } = usePurchaseManager();

  if (hasPurchased('premium_membership')) {
    // User has this product
  }

  const boost_count = getPurchaseBalance('boost_x2');
  // Returns: 0, 1, 2, etc.
}
```

### Consume Purchases

When user uses a consumable item:

```typescript
const { consumePurchase } = usePurchaseManager();

async function useBoost() {
  try {
    const result = await consumePurchase('boost_x2', 1);
    console.log('Remaining:', result.quantity);
    // Update UI, grant reward, etc.
  } catch (error) {
    console.error('Consume failed:', error);
  }
}
```

### Record Purchases

Automatically log purchases for history:

```typescript
const { recordPurchaseInMemory } = usePurchaseManager();

// After successful purchase
await recordPurchaseInMemory(
  'premium_membership',
  'Premium Membership',
  9.99
);
```

---

## Direct SDK Usage

For advanced usage, access the SDKLite instance directly:

```typescript
import { usePiAuth } from '@/contexts/pi-auth-context';

function AdvancedPayment() {
  const { sdk, isAuthenticated } = usePiAuth();

  const handleCustomPurchase = async () => {
    if (!sdk) return;
    
    try {
      const result = await sdk.makePurchase('product_slug');
      if (result.ok) {
        console.log('Payment ID:', result.paymentId);
        console.log('Transaction ID:', result.txid);
      }
    } catch (error) {
      // Handle error
    }
  };

  return <button onClick={handleCustomPurchase}>Buy Now</button>;
}
```

---

## Error Handling

The payment system uses **SDKLiteError** for purchase errors:

```typescript
try {
  const result = await makePurchase('product_id');
} catch (error) {
  if (error instanceof Error && error.name === 'SDKLiteError') {
    const code = (error as any).code;
    
    switch (code) {
      case 'product_not_found':
        console.log('Product not in App Studio catalog');
        break;
      case 'purchase_cancelled':
        console.log('User dismissed payment UI');
        break;
      case 'purchase_error':
        console.log('Payment processing failed');
        break;
    }
  }
}
```

**Common Error Codes:**
- `product_not_found`: Product slug doesn't exist in App Studio
- `purchase_cancelled`: User dismissed the payment UI
- `purchase_error`: Generic failure (auth, offer, approval, completion)

---

## Backend Payment Recording

Payment confirmations are sent to `/api/payments`:

```typescript
// Automatic - SDKLite handles this
POST /api/payments
{
  "userId": "user123",
  "productId": "premium_membership",
  "paymentId": "payment_abc123",
  "txid": "0x...",
  "amount": 9.99
}
```

Response:
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "paymentId": "payment_abc123",
  "orderId": "ORDER-1718..."
}
```

---

## Best Practices

1. **Always check authentication**: Verify user is logged in via Pi Network
2. **Validate products exist**: Use `hasPurchased()` before granting access
3. **Handle errors gracefully**: Show user-friendly messages
4. **Restore on load**: Call `restorePurchases()` when app starts
5. **Record in history**: Log purchases for transaction records
6. **Test in sandbox**: Use `SANDBOX: true` in development
7. **Verify before delivering**: Check `result.ok` after purchase

---

## Configuration

Edit `/lib/system-config.ts`:

```typescript
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  SANDBOX: false, // Set to true for development
} as const;
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Pi Unavailable" | App must run in Pi Browser or Pi Sandbox |
| "Product not found" | Verify product ID matches App Studio exactly |
| Payment stuck/freezing | Check console for errors, clear cache |
| Balance not updating | Call `restorePurchases()` manually |
| No payment UI shown | Ensure user is authenticated first |

---

## File Structure

```
lib/
├── product-config.ts       # Product definitions
├── pi-payment.ts           # Hooks (usePurchase, useAds, useUserState)
├── purchase-manager.ts     # Purchase tracking & consumption
└── system-config.ts        # SDK configuration

components/
├── payment-button.tsx      # Single purchase button
└── payment-sheet.tsx       # Multi-product shop

app/api/
└── payments/route.ts       # Payment callback handler

contexts/
└── pi-auth-context.tsx     # SDK initialization & auth
```

---

## Example: Complete Payment Flow

```tsx
'use client';

import { useState } from 'react';
import { PaymentButton } from '@/components/payment-button';
import { usePurchaseManager } from '@/lib/purchase-manager';

export function Shop() {
  const { hasPurchased, recordPurchaseInMemory } = usePurchaseManager();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handlePurchaseSuccess = async (result: any) => {
    // Record in history
    await recordPurchaseInMemory('premium_membership', 'Premium', 9.99);
    
    // Update UI
    setPurchasedItems((prev) => [...prev, result.productId]);
    
    // Show message
    alert('🎉 Purchase successful!');
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h2>Premium Membership - 9.99 Pi</h2>
        <p>Unlock all features for 30 days</p>
        
        {hasPurchased('premium_membership') ? (
          <p className="text-green-500">✓ Already purchased</p>
        ) : (
          <PaymentButton
            productId="premium_membership"
            productName="Premium Membership"
            price={9.99}
            onSuccess={handlePurchaseSuccess}
          />
        )}
      </div>
    </div>
  );
}
```

---

## Support

For issues:
1. Check console for `[PiAuth]` and `[Payment]` logs
2. Verify product IDs in App Studio match config
3. Ensure user is authenticated in Pi Browser
4. Review error codes and messages

For Pi Network documentation: https://developers.pi.network
