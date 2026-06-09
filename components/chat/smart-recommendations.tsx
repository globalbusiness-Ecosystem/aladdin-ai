'use client';

import { useEffect, useState } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { generateRecommendations, Recommendation } from '@/lib/aladdin-memory';

interface SmartRecommendationsProps {
  userMessage: string;
  onSelectRecommendation?: (appName: string) => void;
}

export function SmartRecommendations({
  userMessage,
  onSelectRecommendation
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (userMessage.trim()) {
      const recs = generateRecommendations(userMessage);
      setRecommendations(recs.filter(r => r.confidence > 0.3));
    }
  }, [userMessage]);

  if (recommendations.length === 0) return null;

  return (
    <div className="px-4 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#0F0F0F] border-t border-[#222222]">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-[#D4AF37]" />
        <span className="text-xs font-semibold text-[#D4AF37]">Smart Recommendations</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {recommendations.map((rec) => (
          <button
            key={rec.appId}
            onClick={() => onSelectRecommendation?.(rec.appName)}
            className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-[#D4AF37]/20 to-[#C49A2A]/10 border border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37]/60 transition-all group whitespace-nowrap"
          >
            <p className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
              {rec.appName}
            </p>
            <p className="text-xs text-[#999999] group-hover:text-[#D4AF37]/70 transition-colors">
              {rec.reason}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
