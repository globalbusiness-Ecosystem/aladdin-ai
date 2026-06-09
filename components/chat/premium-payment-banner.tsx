'use client';

import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { PRODUCT_CONFIG } from '@/lib/product-config';
import { useI18n } from '@/contexts/i18n-context';

interface PremiumPaymentBannerProps {
  onPurchaseSuccess?: () => void;
}

export function PremiumPaymentBanner({ onPurchaseSuccess }: PremiumPaymentBannerProps) {
  const { t } = useI18n();
  const { products, restoredPurchases, sdk } = usePiAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Find the Aladdin Premium product
  const product = products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_6a274f1f1381e5f404fd0c8a
  );

  // Check if user already has the premium product
  const hasPremium =
    restoredPurchases?.some(
      (p) => p.productId === product?.slug
    ) ?? false;

  // If product not found or user already has premium, don't show banner
  if (!product || hasPremium) {
    return null;
  }

  const handlePurchase = async () => {
    if (!sdk || !product) {
      setError('Product or SDK not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sdk.makePurchase(product.slug);

      if (result.ok) {
        setSuccess(true);
        onPurchaseSuccess?.();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Purchase failed. Please try again.');
      }
    } catch (err: any) {
      const errorCode = err?.code || 'unknown_error';
      const errorMessages: Record<string, string> = {
        product_not_found: 'Product not found. Please try again.',
        purchase_cancelled: 'Purchase was cancelled.',
        purchase_error: 'An error occurred during purchase. Please try again.',
        unknown_error: 'An unexpected error occurred. Please try again.',
      };
      setError(errorMessages[errorCode] || errorMessages.unknown_error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative px-4 py-3 mx-4 mb-3 rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#0F0F0F] border border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/10">
      {/* Success State */}
      {success && (
        <div className="flex items-center gap-3 text-[#4ADE80]">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Premium activated! Enjoy unlimited access.</span>
        </div>
      )}

      {/* Error State */}
      {error && !success && (
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="flex-shrink-0 w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Default State */}
      {!success && !error && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Zap className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                {product.name}
              </p>
              <p className="text-xs text-[#999999] line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F0D857] text-[#0A0A0A] rounded-lg font-semibold text-sm px-4 py-2 flex-shrink-0 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60 whitespace-nowrap"
          >
            {isLoading ? 'Processing...' : `${product.price_in_pi.toFixed(1)} Pi`}
          </Button>
        </div>
      )}
    </div>
  );
}
