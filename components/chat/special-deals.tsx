'use client';

import { Zap, TrendingUp, Gift } from 'lucide-react';

export interface Deal {
  id: string;
  appName: string;
  title: string;
  discount: number;
  category: string;
  expiresIn: string;
  badge?: string;
}

interface SpecialDealsProps {
  onDealClick?: (deal: Deal) => void;
}

const FEATURED_DEALS: Deal[] = [
  {
    id: '1',
    appName: 'RE Global',
    title: '20% off on first property listing',
    discount: 20,
    category: 'Real Estate',
    expiresIn: '48 hours',
    badge: 'Hot'
  },
  {
    id: '2',
    appName: 'Global Motor',
    title: 'Free premium inspection with purchase',
    discount: 15,
    category: 'Automotive',
    expiresIn: '7 days',
    badge: 'New'
  },
  {
    id: '3',
    appName: 'Merit',
    title: 'Get 3 courses for price of 2',
    discount: 33,
    category: 'Education',
    expiresIn: '30 days',
  },
  {
    id: '4',
    appName: 'GlobalWeavers',
    title: 'Bulk orders get 25% discount',
    discount: 25,
    category: 'Fashion',
    expiresIn: '14 days',
    badge: 'Trending'
  },
];

export function SpecialDeals({ onDealClick }: SpecialDealsProps) {
  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0F0F0F] rounded-xl border border-[#D4AF37]/20 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="text-sm font-bold text-white">Today is Special Deals</h3>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FEATURED_DEALS.map((deal) => (
          <button
            key={deal.id}
            onClick={() => onDealClick?.(deal)}
            className="relative bg-gradient-to-br from-[#0F0F0F] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-4 hover:border-[#D4AF37]/50 transition-all group overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <div className="relative z-10">
              {/* Badge */}
              {deal.badge && (
                <div className="inline-block mb-2 px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded text-xs font-bold text-[#D4AF37]">
                  {deal.badge}
                </div>
              )}

              {/* Content */}
              <div className="text-left space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs text-[#999999]">{deal.appName}</p>
                  <p className="text-lg font-bold text-[#D4AF37]">{deal.discount}%</p>
                </div>
                <p className="text-xs font-semibold text-white leading-tight line-clamp-2">
                  {deal.title}
                </p>
                <p className="text-xs text-[#666666]">Expires in {deal.expiresIn}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
