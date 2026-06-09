'use client';

import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PaymentButton } from '@/components/payment-button';
import { PRODUCT_CONFIG } from '@/lib/product-config';

export interface PaymentOffer {
  category: string;
  title: string;
  description?: string;
  productId: string;
  price: number;
  features?: string[];
  highlight?: boolean;
}

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  offers?: PaymentOffer[];
}

export function PaymentSheet({ isOpen, onClose, offers }: PaymentSheetProps) {


  const defaultOffers: PaymentOffer[] = [
    {
      category: 'Premium',
      title: 'Premium Membership',
      description: 'Unlock all features for 30 days',
      productId: 'premium_membership',
      price: 9.99,
      features: [
        'Unlimited listings',
        'Priority support',
        'Advanced analytics',
        'Featured placement',
      ],
      highlight: true,
    },
    {
      category: 'Real Estate',
      title: 'Property Listing',
      description: 'List one property on RE Global',
      productId: 'property_listing',
      price: 2.99,
      features: ['Basic listing', '30-day visibility'],
    },
    {
      category: 'Real Estate',
      title: 'Featured Listing',
      description: 'Boost visibility for 7 days',
      productId: 'featured_listing',
      price: 4.99,
      features: ['Highlighted placement', 'Extra visibility', '7-day boost'],
    },
    {
      category: 'Support',
      title: 'Priority Support',
      description: 'Get instant support for 30 days',
      productId: 'priority_support',
      price: 4.99,
      features: ['1-hour response time', 'Direct access', '30-day coverage'],
    },
  ];

  const displayOffers = offers || defaultOffers;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-[#0A0A0A] border-t border-[#222222] max-h-[85vh] overflow-y-auto">
        <SheetHeader className="border-b border-[#222222] pb-4 mb-4">
          <SheetTitle className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Unlock Premium Features
          </SheetTitle>
          <p className="text-xs text-[#999999] mt-2">
            Enhance your experience with Aladdin Pro features powered by Pi Network
          </p>
        </SheetHeader>

        <div className="space-y-4 pb-4">
          {displayOffers.map((offer, idx) => (
            <div
              key={idx}
              className={`relative w-full bg-gradient-to-r ${
                offer.highlight
                  ? 'from-[#D4AF37]/20 to-[#C49A2A]/10 border-[#D4AF37]/60'
                  : 'from-[#1A1A1A] to-[#0F0F0F] border-[#222222]'
              } border rounded-xl p-4 hover:border-[#D4AF37]/40 transition-all group overflow-hidden`}
            >
              <div className="relative z-10 text-left space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                        {offer.category}
                      </p>
                      {offer.highlight && (
                        <span className="px-2 py-0.5 bg-[#D4AF37]/30 border border-[#D4AF37] rounded text-xs font-bold text-[#D4AF37]">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-xs text-[#999999] mt-1">{offer.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-[#D4AF37]">{offer.price}</p>
                    <p className="text-xs text-[#999999]">Pi</p>
                  </div>
                </div>
                {offer.features && offer.features.length > 0 && (
                  <div className="pt-2 border-t border-[#222222]">
                    <ul className="space-y-1">
                      {offer.features.map((feature, i) => (
                        <li key={i} className="text-xs text-[#CCCCCC] flex items-center gap-2">
                          <span className="text-[#D4AF37]">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-2">
                  <PaymentButton
                    productId={offer.productId}
                    productName={offer.title}
                    price={offer.price}
                    onSuccess={() => setTimeout(() => onClose(), 1500)}
                    className="w-full"
                    size="md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </SheetContent>
    </Sheet>
  );
}
