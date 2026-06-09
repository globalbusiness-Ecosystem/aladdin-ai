'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { usePurchaseManager } from '@/lib/purchase-manager';

export function PaymentStatus() {
  const { purchases, isLoading } = usePurchaseManager();
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    // Calculate approximate total spent (for demo)
    const total = purchases.reduce((sum, p) => {
      const priceMap: Record<string, number> = {
        premium_membership: 9.99,
        platinum_plus: 19.99,
        property_listing: 2.99,
        featured_listing: 4.99,
        vehicle_listing: 1.99,
        vehicle_verification: 2.49,
        course_access: 3.99,
        certification: 5.99,
        bulk_discount: 6.99,
        shop_featured: 7.99,
        priority_support: 4.99,
        expert_consultation: 8.99,
      };
      return sum + (priceMap[p.productId] || 0);
    }, 0);
    setTotalSpent(total);
  }, [purchases]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border border-[#222222] rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-[#333333] rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-[#222222] rounded w-1/3"></div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border border-[#222222] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <p className="text-sm font-semibold text-white">No Premium Features</p>
            <p className="text-xs text-[#999999] mt-0.5">
              Upgrade to unlock premium features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border border-[#D4AF37]/30 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h3 className="text-sm font-bold text-white">Active Purchases</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0F0F0F] border border-[#222222] rounded p-3">
          <p className="text-xs text-[#999999]">Total Items</p>
          <p className="text-lg font-bold text-[#D4AF37] mt-1">
            {purchases.length}
          </p>
        </div>
        <div className="bg-[#0F0F0F] border border-[#222222] rounded p-3">
          <p className="text-xs text-[#999999]">Total Spent</p>
          <p className="text-lg font-bold text-[#D4AF37] mt-1">
            {totalSpent.toFixed(2)} Pi
          </p>
        </div>
      </div>

      {/* Purchase List */}
      <div className="space-y-2">
        {purchases.map((purchase) => (
          <div
            key={purchase.productId}
            className="flex items-center justify-between p-2 bg-[#0F0F0F] border border-[#222222] rounded"
          >
            <span className="text-xs font-semibold text-[#D4AF37]">
              {purchase.productId.replace(/_/g, ' ').toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#999999]">Qty:</span>
              <span className="text-sm font-bold text-white">
                {purchase.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="pt-2 border-t border-[#222222] text-xs text-[#999999]">
        <p>✓ All features automatically activated</p>
        <p>✓ Consumables deducted when used</p>
      </div>
    </div>
  );
}

export function PaymentNotification({
  productName,
  amount,
  onClose,
}: {
  productName: string;
  amount: number;
  onClose?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2 z-50">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-white">{productName}</p>
          <p className="text-sm text-green-200/80 mt-1">
            ✓ Purchase successful! {amount} Pi deducted.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PaymentErrorNotification({
  error,
  onClose,
}: {
  error: string;
  onClose?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2 z-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-white">Payment Failed</p>
          <p className="text-sm text-red-200/80 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
}
