'use client';

import { useEffect, useState } from 'react';
import { History, Trash2, User } from 'lucide-react';
import { getUserProfile, updateUserInterests } from '@/lib/aladdin-memory';
import { Button } from '@/components/ui/button';

interface UserProfileCardProps {
  onClose?: () => void;
}

export function UserProfileCard({ onClose }: UserProfileCardProps) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const prof = getUserProfile();
    setProfile(prof);
  }, []);

  if (!profile) return null;

  const stats = [
    { label: 'Interests', value: profile.interests?.length || 0 },
    { label: 'Apps Viewed', value: profile.viewedApps?.length || 0 },
    { label: 'Purchases', value: profile.purchaseHistory?.length || 0 },
    { label: 'Conversations', value: profile.conversationCount || 0 },
  ];

  const totalSpent = profile.purchaseHistory?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl border border-[#D4AF37]/30 p-6 space-y-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C49A2A] flex items-center justify-center">
            <User className="w-6 h-6 text-[#0A0A0A]" />
          </div>
          <div>
            <p className="font-semibold text-white">Aladdin User</p>
            <p className="text-xs text-[#999999]">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#666666] hover:text-white">
            ×
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#141414] rounded-lg p-4 border border-[#222222]">
            <p className="text-2xl font-bold text-[#D4AF37]">{stat.value}</p>
            <p className="text-xs text-[#999999] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Total Spent */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#C49A2A]/10 rounded-lg p-4 border border-[#D4AF37]/30">
        <p className="text-sm text-[#999999]">Total Value</p>
        <p className="text-2xl font-bold text-[#D4AF37] mt-1">{totalSpent} Pi</p>
      </div>

      {/* Interests */}
      {profile.interests?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-white mb-3">Your Interests</p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 8).map((interest: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-xs text-[#D4AF37]">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Apps */}
      {profile.viewedApps?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recently Viewed
          </p>
          <div className="space-y-2">
            {profile.viewedApps.slice(-3).reverse().map((app: string, idx: number) => (
              <p key={idx} className="text-xs text-[#D4AF37] bg-[#141414] px-3 py-2 rounded-lg">
                • {app}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
