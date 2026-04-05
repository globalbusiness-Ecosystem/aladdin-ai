'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSlider from '@/components/hero-slider';
import { ChatHeader } from '@/components/chat/chat-header';
import { ConversationsSidebar } from '@/components/chat/conversations-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { AttachmentSheet } from '@/components/chat/attachment-sheet';
import { SmartRecommendations } from '@/components/chat/smart-recommendations';
import { useI18n } from '@/contexts/i18n-context';
import {
  getUserProfile,
  updateUserInterests,
  recordAppView,
  getConversationMemory,
  generateRecommendations
} from '@/lib/aladdin-memory';

export default function Home() {
  const { t, isRTL } = useI18n();
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; attachment?: any }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [currency, setCurrency] = useState('Pi');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleNavigateToChat = (event: any) => {
      setActiveTab('chat');
      if (event.detail?.message) {
        setPrefillMessage(event.detail.message);
      }
    };
    window.addEventListener('navigateToChat', handleNavigateToChat);
    return () => window.removeEventListener('navigateToChat', handleNavigateToChat);
  }, []);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
  }, []);

  const categories = [
    { icon: '🏢', title: t('category.realEstate'), description: t('category.realEstateDesc'), color: 'from-amber-900' },
    { icon: '🚗', title: t('category.automotive'), description: t('category.automotiveDesc'), color: 'from-yellow-900' },
    { icon: '💼', title: t('category.trade'), description: t('category.tradeDesc'), color: 'from-amber-800' },
    { icon: '👗', title: t('category.fashion'), description: t('category.fashionDesc'), color: 'from-yellow-800' },
    { icon: '📚', title: t('category.education'), description: t('category.educationDesc'), color: 'from-amber-700' },
    { icon: '💬', title: t('category.liveChat'), description: t('category.liveChatDesc'), color: 'from-yellow-700' }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelected = (file: File, type: 'image' | 'document' | 'location') => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result as string;

      if (type === 'image') {
        const message = {
          text: 'Shared an image',
          sender: 'user' as const,
          attachment: {
            type: 'image' as const,
            data: data,
            name: file.name
          }
        };
        setMessages(prev => [...prev, message]);
      } else if (type === 'document') {
        const message = {
          text: 'Shared a document',
          sender: 'user' as const,
          attachment: {
            type: 'file' as const,
            data: data,
            name: file.name,
            size: formatFileSize(file.size),
            mimeType: file.type
          }
        };
        setMessages(prev => [...prev, message]);
      } else if (type === 'location') {
        try {
          const locationData = JSON.parse(data);
          const message = `📍 Location: ${locationData.latitude}, ${locationData.longitude} (±${locationData.accuracy}m)`;
          setMessages(prev => [...prev, { text: message, sender: 'user' }]);
          setIsLoading(true);
          setTimeout(() => {
            setMessages(prev => [...prev, { text: 'Thanks for sharing your location! How can I help you with that area?', sender: 'ai' }]);
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error('Error parsing location data:', error);
        }
      }
    };

    if (type === 'image') {
      reader.readAsDataURL(file);
    } else if (type === 'document') {
      reader.readAsDataURL(file);
    } else if (type === 'location') {
      reader.readAsText(file);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue;
      setInputValue('');
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setIsLoading(true);

      const keywords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      updateUserInterests(keywords);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, { text: userMessage, sender: 'user' }],
            userProfile: userProfile,
            userMessage: userMessage,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        setMessages(prev => [...prev, { text: data.text, sender: 'ai' }]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, {
          text: 'I apologize, I am having trouble connecting. Please try again.',
          sender: 'ai'
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const appsData = [
    { code: 'RE', name: 'RE Global', category: 'Real Estate', description: 'Buy rent invest in properties worldwide' },
    { code: 'GM', name: 'Global Motor', category: 'Automotive', description: 'Premium cars with Pi payments' },
    { code: 'GB', name: 'Globy', category: 'Trade', description: 'Connect with global suppliers' },
    { code: 'GW', name: 'GlobalWeavers', category: 'Textiles', description: 'Premium fabrics worldwide' },
    { code: 'ME', name: 'Merit', category: 'Education', description: 'Learn and earn with Pi' },
    { code: 'EM', name: 'EM', category: 'Shopping', description: 'Everything market on Pi' },
    { code: 'FH', name: 'FourHands', category: 'Services', description: 'Professional services with Pi' }
  ];

  const filterCategories = ['All', 'Real Estate', 'Automotive', 'Trade', 'Education', 'Shopping', 'Services'];
  const filteredApps = selectedCategory === 'All'
    ? appsData
    : appsData.filter(app => app.category === selectedCategory);

  return (
    <div className={`flex h-screen flex-col bg-[#0A0A0A] text-foreground ${isRTL ? 'rtl' : 'ltr'}`}>
      <ChatHeader
        onMenuOpen={() => setIsSidebarOpen(true)}
        onExploreClick={() => setActiveTab('explore')}
        onShowConversations={() => setIsSidebarOpen(true)}
        userInitial="A"
      />

      <ConversationsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-hidden mt-20 mb-20 flex flex-col bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <ChatMessages messages={messages} isLoading={isLoading} />

            {inputValue && (
              <SmartRecommendations
                userMessage={inputValue}
                onSelectRecommendation={(appName) => {
                  setPrefillMessage(`Tell me more about ${appName}`);
                  handleSendMessage();
                }}
              />
            )}

            <ChatInput
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={() => {
                if (!isLoading) {
                  handleSendMessage();
                }
              }}
              onMicClick={() => console.log('Mic clicked')}
              onAttachmentClick={() => setIsAttachmentSheetOpen(true)}
              isLoading={isLoading}
              prefillMessage={prefillMessage}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-4 bg-gradient-to-br from-[#0A0A0A] to-[#0F0F0F]">
            <div className="w-full px-4 py-4 border-b border-[#222222] bg-gradient-to-r from-[#0A0A0A] to-[#0F0F0F]">
              <p className="text-xl font-bold text-[#D4AF37] leading-tight">{t('explore.title')}</p>
              <p className="text-xs text-[#666666] mt-1">{t('explore.subtitle')}</p>
            </div>

            <div className="w-full overflow-x-auto px-4 py-3 border-b border-[#222222] flex gap-2">
              {filterCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#E8C547] text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/20'
                      : 'bg-[#141414] text-[#A0A0A0] border border-[#222222] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="px-4 py-4 space-y-3">
              {filteredApps.map((app, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrefillMessage(`Tell me about ${app.name}`);
                    setActiveTab('chat');
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-[#141414] to-[#0F0F0F] border border-[#222222] hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 float-in"
                  style={{ minHeight: '100px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-[#A0860F]/10 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-lg flex-col">
                    <span>{app.code[0]}</span>
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="text-base font-bold text-white truncate">{app.name}</p>
                    <p className="text-xs text-[#D4AF37] font-semibold">{app.category}</p>
                    <p className="text-xs text-[#999999] truncate mt-0.5">{app.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-[#D4AF37] text-lg">→</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-gradient-to-t from-[#0A0A0A] to-[#0F0F0F] border-t border-[#222222] px-4 py-3 shadow-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-lg transition-all duration-200 ${
            activeTab === 'chat'
              ? 'text-[#D4AF37] bg-[#1A1A1A] shadow-lg shadow-[#D4AF37]/10'
              : 'text-[#666666] hover:text-[#D4D4D4]'
          }`}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs font-semibold">{t('nav.chat')}</span>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-lg transition-all duration-200 ${
            activeTab === 'explore'
              ? 'text-[#D4AF37] bg-[#1A1A1A] shadow-lg shadow-[#D4AF37]/10'
              : 'text-[#666666] hover:text-[#D4D4D4]'
          }`}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs font-semibold">{t('nav.explore')}</span>
        </button>
      </nav>

      <AttachmentSheet
        isOpen={isAttachmentSheetOpen}
        onClose={() => setIsAttachmentSheetOpen(false)}
        onFileSelected={handleFileSelected}
      />
    </div>
  );
}
