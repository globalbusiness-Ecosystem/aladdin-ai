'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Download, Filter } from 'lucide-react';
import { getUserProfile } from '@/lib/aladdin-memory';

export function TransactionHistory() {
  const [profile, setProfile] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    const prof = getUserProfile();
    setProfile(prof);
  }, []);

  if (!profile?.purchaseHistory || profile.purchaseHistory.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl border border-[#222222] p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-[#666666] mx-auto mb-3 opacity-50" />
        <p className="text-[#999999]">No transactions yet</p>
        <p className="text-xs text-[#666666] mt-1">Your purchases will appear here</p>
      </div>
    );
  }

  const categories = ['All', ...new Set(profile.purchaseHistory.map((p: any) => p.category))];
  
  const filtered = filterCategory === 'All' 
    ? profile.purchaseHistory 
    : profile.purchaseHistory.filter((p: any) => p.category === filterCategory);

  const totalAmount = filtered.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-lg p-4 border border-[#D4AF37]/30">
          <p className="text-xs text-[#999999]">Total Transactions</p>
          <p className="text-2xl font-bold text-[#D4AF37] mt-1">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-lg p-4 border border-[#D4AF37]/30">
          <p className="text-xs text-[#999999]">Total Value</p>
          <p className="text-2xl font-bold text-[#D4AF37] mt-1">{totalAmount} Pi</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-[#D4AF37] text-[#0A0A0A]'
                : 'bg-[#141414] text-[#999999] border border-[#222222] hover:border-[#D4AF37]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filtered.map((transaction: any, idx: number) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#141414] to-[#0F0F0F] border border-[#222222] rounded-lg p-4 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all"
          >
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{transaction.appName}</p>
              <p className="text-xs text-[#999999] mt-1">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
              {transaction.details && (
                <p className="text-xs text-[#666666] mt-1">{transaction.details}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <p className="font-bold text-[#D4AF37] text-sm">{transaction.amount}</p>
              <p className="text-xs text-[#999999]">{transaction.currency}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Export Button */}
      <button className="w-full bg-gradient-to-r from-[#D4AF37]/10 to-[#C49A2A]/10 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 rounded-lg py-3 text-[#D4AF37] font-semibold text-sm flex items-center justify-center gap-2 transition-all">
        <Download className="w-4 h-4" />
        Download Statement
      </button>
    </div>
  );
}
