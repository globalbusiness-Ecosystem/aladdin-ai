'use client';

import { useState } from 'react';
import { Menu, Settings, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/contexts/i18n-context';

interface ModernHeaderProps {
  onLanguageChange?: (lang: string) => void;
  onCurrencyChange?: (currency: string) => void;
}

export function ModernHeader({ onLanguageChange, onCurrencyChange }: ModernHeaderProps) {
  const { language, setLanguage, t, isRTL } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('Pi');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tr', name: 'Türkçe' }
  ];

  const currencies = ['Pi', 'USD', 'EUR', 'GBP', 'JPY', 'AED'];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as any);
    onLanguageChange?.(newLang);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
  };

  return (
    <>
      {/* Modern Header with Gradient Background */}
      <header className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] px-4 py-3 border-b border-[#222222] shadow-lg backdrop-blur-md ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Left Section - Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#D4AF37] hover:bg-[#1a1a1a] hover:text-[#E8C547] transition-all duration-200 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side={isRTL ? "right" : "left"} 
            className="w-72 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] border-r border-[#222222] p-0 flex flex-col shadow-2xl"
          >
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* User Info */}
              <div className={`pb-6 border-b border-[#222222] ${isRTL ? 'text-right' : ''}`}>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A0860F] border border-[#D4AF37] flex items-center justify-center mb-3 mx-auto">
                  <span className="text-xl font-bold text-[#0A0A0A]">👤</span>
                </div>
                <p className="text-sm font-semibold text-white">{t('sidebar.welcome')}</p>
                <p className="text-xs text-[#A0A0A0] mt-1">{t('sidebar.member')}</p>
              </div>

              {/* Menu Sections */}
              {[
                { title: 'sidebar.recentChats', items: ['Real Estate Investment', 'Automotive Query'] },
                { title: 'sidebar.myOrders', items: ['Pending Orders', 'Completed'] },
                { title: 'sidebar.favorites', items: ['My Favorites'] },
                { title: 'sidebar.myAccount', items: ['Account Settings', 'Preferences'] }
              ].map((section) => (
                <div key={section.title}>
                  <p className="text-xs text-[#666666] mb-3 uppercase font-bold tracking-widest">{t(section.title)}</p>
                  <nav className="space-y-2">
                    {section.items.map((item) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="block text-sm text-[#D4D4D4] hover:text-[#D4AF37] transition-colors py-1.5"
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            {/* Bottom Branding */}
            <div className="p-6 border-t border-[#222222] bg-black/40">
              <p className="text-xs text-[#D4AF37] font-bold tracking-widest">{t('header.subtitle')}</p>
              <p className="text-xs text-[#666666] mt-2">{t('header.powered')}</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center Section - Branding */}
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <p className="text-xs text-[#D4AF37] font-bold tracking-widest pulse-glow">{t('header.subtitle')}</p>
          <h1 className="text-2xl font-black text-white tracking-wider">{t('header.title')}</h1>
        </div>

        {/* Right Section - Settings & More */}
        <div className="flex gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#D4AF37] hover:bg-[#1a1a1a] hover:text-[#E8C547] transition-all duration-200 rounded-lg"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F] border border-[#222222] shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#D4AF37] text-lg font-bold">{t('sidebar.settings')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="text-sm font-semibold text-white block mb-3">{t('settings.language')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          language === lang.code
                            ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-lg'
                            : 'bg-[#0A0A0A] border border-[#222222] text-[#D4D4D4] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="text-sm font-semibold text-white block mb-3">{t('settings.currency')}</label>
                  <select 
                    value={selectedCurrency} 
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#222222] rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-[#222222]">
                    <label className="text-sm font-medium text-white">{t('settings.darkMode')}</label>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[#D4AF37] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-[#222222]">
                    <label className="text-sm font-medium text-white">{t('settings.notifications')}</label>
                    <input 
                      type="checkbox" 
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="w-5 h-5 rounded accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </>
  );
}
