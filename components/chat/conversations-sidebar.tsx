'use client';

import { MessageCircle, X, PenTool } from 'lucide-react';
import { useState } from 'react';

interface ConversationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationsSidebar({ isOpen, onClose }: ConversationsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    { id: 1, title: 'Chat 1', date: 'Today' },
    { id: 2, title: 'Chat 2', date: 'Today' },
    { id: 3, title: 'Chat 3', date: 'Yesterday' },
    { id: 4, title: 'Chat 4', date: '2 days ago' },
    { id: 5, title: 'Chat 5', date: '3 days ago' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-4/5 bg-[#0D0D0D] overflow-y-auto transform transition-transform duration-300 ease-out flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        {/* Top Section - Close Button */}
        <div className="flex items-center justify-end p-4 border-b border-[#222222]">
          <button
            onClick={onClose}
            className="text-white hover:bg-[#1a1a1a] p-2 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#222222]">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white placeholder-[#666666] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-[#222222]">
          <button className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0D0D0D] font-semibold py-2.5 rounded-lg hover:bg-[#E5C158] transition-colors">
            <PenTool className="w-4 h-4" />
            NEW CHAT
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 p-4">
          <p className="text-xs text-[#666666] font-semibold mb-4 uppercase tracking-wider">RECENT CHATS</p>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left"
              >
                <MessageCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{conv.title}</p>
                  <p className="text-xs text-[#666666]">{conv.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#222222] space-y-3">
          <p className="text-xs text-[#D4AF37] font-semibold text-center tracking-widest">
            GlobalBusiness Ecosystem
          </p>
          <div className="text-center">
            <a href="#" className="text-xs text-[#999999] hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </a>
            <span className="text-xs text-[#666666]"> - </span>
            <a href="#" className="text-xs text-[#999999] hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
