'use client';

import { useState } from 'react';
import { Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationsSidebar } from './conversations-sidebar';
import { AccountModal } from './account-modal';

interface ChatHeaderProps {
  onMenuOpen: () => void;
  onExploreClick?: () => void;
  onShowConversations?: () => void;
  userInitial?: string;
  isAuthenticated?: boolean;
  username?: string;
}

export function ChatHeader({ onMenuOpen, onExploreClick, onShowConversations, userInitial = 'A', isAuthenticated = false, username = 'User' }: ChatHeaderProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isConversationsSidebarOpen, setIsConversationsSidebarOpen] = useState(false);

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 border-b"
        style={{
          height: '56px',
          background: 'linear-gradient(to right, #0A0A0A, #1A1400)',
          borderColor: 'rgba(201,168,76,0.3)',
          boxShadow: '0 1px 20px rgba(201,168,76,0.1)'
        }}
      >
        {/* Left: Gear Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#1a1a1a] transition-colors rounded-md w-9 h-9 p-0"
          title="Account"
          onClick={() => setIsAccountModalOpen(true)}
          style={{ color: '#C9A84C' }}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Center: Branding Stack */}
        <div className="flex flex-col items-center gap-0">
          <p 
            className="font-semibold tracking-[3px]"
            style={{ 
              fontSize: '9px', 
              color: '#C9A84C',
              opacity: 0.8,
              letterSpacing: '3px'
            }}
          >
            GLOBALBUSINESS
          </p>
          <h1 
            className="font-black tracking-[4px]"
            style={{ 
              fontSize: '20px', 
              color: 'white',
              letterSpacing: '4px',
              fontWeight: 900
            }}
          >
            • ALADDIN •
          </h1>
        </div>

        {/* Right: Hamburger Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#1a1a1a] transition-colors rounded-md w-9 h-9 p-0"
          title="Menu"
          onClick={() => setIsConversationsSidebarOpen(true)}
          style={{ color: '#C9A84C' }}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Account Modal - Slides up from bottom */}
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onExploreClick={onExploreClick}
        onShowConversations={onShowConversations}
      />

      {/* Conversations Sidebar - Slides in from right */}
      <ConversationsSidebar 
        isOpen={isConversationsSidebarOpen} 
        onClose={() => setIsConversationsSidebarOpen(false)}
      />
    </>
  );
}
