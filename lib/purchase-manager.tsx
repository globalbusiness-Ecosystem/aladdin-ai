'use client';

import { useUserState } from '@/lib/pi-payment';
import { useState, useEffect } from 'react';

export interface PurchaseItem {
  productId: string;
  quantity: number;
  purchasedAt?: string;
}

interface PurchaseManagerProps {
  onPurchasesUpdated?: (purchases: PurchaseItem[]) => void;
}

export function usePurchaseManager(options?: { autoRestore?: boolean }) {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const userState = useUserState();

  // Restore purchases on mount
  useEffect(() => {
    if (options?.autoRestore !== false) {
      restorePurchases();
    }
  }, []);

  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { purchases: restored } = await userState.restore();
      const items: PurchaseItem[] = restored.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
      }));
      setPurchases(items);
      return items;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Failed to restore purchases:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getPurchaseBalance = (productId: string): number => {
    return purchases.find((p) => p.productId === productId)?.quantity || 0;
  };

  const hasPurchased = (productId: string): boolean => {
    return getPurchaseBalance(productId) > 0;
  };

  const consumePurchase = async (productId: string, quantity = 1) => {
    try {
      const result = await userState.consume(productId, quantity);
      setPurchases((prev) => {
        const existing = prev.find((p) => p.productId === productId);
        if (existing) {
          return prev.map((p) =>
            p.productId === productId
              ? { ...p, quantity: result.quantity }
              : p
          );
        }
        return [...prev, { productId: result.productId, quantity: result.quantity }];
      });
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('Failed to consume purchase:', error);
      throw error;
    }
  };

  const recordPurchaseInMemory = async (productId: string, productName: string, price: number) => {
    try {
      const profile = await userState.get('user_profile');
      const currentProfile = profile?.blob || { purchaseHistory: [] };
      
      const purchaseRecord = {
        productId,
        productName,
        price,
        date: new Date().toISOString(),
        category: getProductCategory(productId),
        amount: price,
        currency: 'Pi',
      };

      currentProfile.purchaseHistory = [
        purchaseRecord,
        ...(currentProfile.purchaseHistory || []),
      ];

      await userState.set('user_profile', currentProfile);
    } catch (err) {
      console.error('Failed to record purchase in memory:', err);
    }
  };

  return {
    purchases,
    isLoading,
    error,
    restorePurchases,
    getPurchaseBalance,
    hasPurchased,
    consumePurchase,
    recordPurchaseInMemory,
  };
}

function getProductCategory(productId: string): string {
  if (productId.includes('property') || productId.includes('listing'))
    return 'Real Estate';
  if (productId.includes('vehicle') || productId.includes('automotive'))
    return 'Automotive';
  if (productId.includes('course') || productId.includes('certification'))
    return 'Education';
  if (productId.includes('shop') || productId.includes('bulk'))
    return 'Commerce';
  if (productId.includes('support') || productId.includes('consultation'))
    return 'Support';
  if (productId.includes('premium') || productId.includes('membership'))
    return 'Premium';
  return 'Other';
}

export function PurchaseHistoryCard() {
  const { purchases } = usePurchaseManager();

  if (purchases.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl border border-[#222222] p-8 text-center">
        <p className="text-[#999999]">No purchases yet</p>
        <p className="text-xs text-[#666666] mt-1">Your purchases will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl border border-[#222222] p-4 space-y-3">
      <h3 className="text-sm font-bold text-white">Active Purchases</h3>
      <div className="space-y-2">
        {purchases.map((purchase) => (
          <div
            key={purchase.productId}
            className="flex items-center justify-between p-3 bg-[#0F0F0F] border border-[#222222] rounded-lg"
          >
            <span className="text-xs font-semibold text-[#D4AF37]">
              {purchase.productId.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="text-sm font-bold text-white">Qty: {purchase.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
