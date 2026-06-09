'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, Check, AlertCircle } from 'lucide-react';
import { usePurchase } from '@/lib/pi-payment';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { Button } from '@/components/ui/button';

interface PaymentButtonProps {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentButton({
  productId,
  productName,
  price,
  currency = 'Pi',
  onSuccess,
  onError,
  className = '',
  size = 'md',
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { makePurchase } = usePurchase();
  const { isAuthenticated, isPiBrowser } = usePiAuth();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please authenticate first');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await makePurchase(productId);
      
      if (result.ok) {
        setStatus('success');
        onSuccess?.(result);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setStatus('idle');
          setIsLoading(false);
        }, 2000);
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      const err = error as any;
      const code = err?.code || 'unknown';
      
      let message = 'Purchase failed. Please try again.';
      if (code === 'product_not_found') {
        message = 'Item is not available.';
      } else if (code === 'purchase_cancelled') {
        message = 'Purchase was cancelled.';
        setStatus('idle');
      } else if (code === 'purchase_error') {
        message = 'Payment error. Please try again.';
      }
      
      if (code !== 'purchase_cancelled') {
        setErrorMessage(message);
        setStatus('error');
        onError?.(err);
      }
      
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  if (!isPiBrowser) {
    return (
      <Button
        disabled
        className={`${sizeClasses[size]} ${className}`}
        title="Pi Network not available"
      >
        <AlertCircle className="w-4 h-4 mr-1" />
        Pi Unavailable
      </Button>
    );
  }

  if (status === 'success') {
    return (
      <Button
        className={`${sizeClasses[size]} bg-green-600 hover:bg-green-700 text-white ${className}`}
        disabled
      >
        <Check className="w-4 h-4 mr-1" />
        Purchased
      </Button>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-2">
        <Button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`${sizeClasses[size]} bg-red-600 hover:bg-red-700 text-white ${className}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-1" />
              Retry Payment
            </>
          )}
        </Button>
        {errorMessage && (
          <p className="text-xs text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading || !isAuthenticated}
      className={`${sizeClasses[size]} bg-gradient-to-r from-[#D4AF37] to-[#E8C547] text-[#0A0A0A] hover:shadow-lg hover:shadow-[#D4AF37]/20 font-semibold transition-all ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          Processing...
        </>
      ) : status === 'processing' ? (
        <>
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          Paying {price} {currency}...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-1" />
          Buy {price} {currency}
        </>
      )}
    </Button>
  );
}
