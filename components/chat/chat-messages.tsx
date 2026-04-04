'use client';

import { useEffect, useRef } from 'react';
import { FileIcon } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { GoldWaves } from './gold-waves';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  attachment?: {
    type: 'image' | 'file';
    data: string;
    name?: string;
    size?: string;
    mimeType?: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  
  // Check if chat is empty (no messages at all)
  const isEmpty = messages.length === 0;

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth flex flex-col"
      style={{
        scrollBehavior: 'smooth',
        backgroundColor: '#0D0D0D',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,168,76,0.03) 40px, rgba(201,168,76,0.03) 41px)'
      }}
    >
      {/* Empty State */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 float-in">
          {/* Egyptian Eye of Horus Symbol */}
          <div className="text-6xl mb-6" style={{ color: '#C9A84C', fontSize: '64px' }}>
            𓂀
          </div>
          
          <p className="text-white text-base font-bold text-center">Hello! I am Aladdin. How can I help you today?</p>
          <p className="text-[#999999] text-sm mt-2">Ask me anything</p>

          {/* Gold Electronic Waves Below Horus Eye */}
          <div className="w-full mt-8">
            <GoldWaves />
          </div>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className="animate-fade-in">
          <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className="flex gap-3 max-w-xs lg:max-w-md">
              {/* AI Avatar - Left Side */}
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A0860F] border border-[#D4AF37]/50 flex items-center justify-center text-xs font-bold flex-col">
                  <span className="text-[#0A0A0A] text-lg">A</span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm break-words transition-all duration-200 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C49A2A] text-[#0A0A0A] font-medium rounded-br-none shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-gradient-to-r from-[#1C1C1C] to-[#141414] text-[#E0E0E0] border-l-2 border-[#D4AF37] rounded-bl-none shadow-md'
                }`}
              >
                {msg.attachment && msg.attachment.type === 'image' && (
                  <img
                    src={msg.attachment.data}
                    alt="Shared image"
                    className="w-48 h-auto rounded-lg mb-2 max-w-full border border-[#D4AF37]/20"
                  />
                )}
                {msg.attachment && msg.attachment.type === 'file' && (
                  <div className="bg-[#0A0A0A] rounded-lg p-3 mb-2 flex items-start gap-3 max-w-xs border border-[#222222]">
                    <FileIcon className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{msg.attachment.name}</p>
                      {msg.attachment.size && (
                        <p className="text-xs text-[#666666] mt-1">{msg.attachment.size}</p>
                      )}
                    </div>
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A0860F] border border-[#D4AF37]/50 flex items-center justify-center text-xs font-bold flex-col">
              <span className="text-[#0A0A0A] text-lg">A</span>
            </div>
            <div className="bg-gradient-to-r from-[#1C1C1C] to-[#141414] border-l-2 border-[#D4AF37] px-4 py-3 rounded-2xl rounded-bl-none flex gap-2">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
