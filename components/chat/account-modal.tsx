'use client';

import { useState } from 'react';
import { X, History, Star, Grid, ShoppingBag, Heart, Settings, MessageCircle, HelpCircle, Camera, ChevronDown, Moon, Bell, Send } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreClick?: () => void;
  onShowConversations?: () => void;
}

export function AccountModal({ isOpen, onClose, onExploreClick, onShowConversations }: AccountModalProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handlePreviousChatsClick = () => {
    onClose();
    onShowConversations?.();
  };

  const handleSmartContextClick = () => {
    showToastMessage('Coming Soon');
  };

  const handleConnectedAppsClick = () => {
    onClose();
    onExploreClick?.();
  };

  const handleMyOrdersClick = () => {
    showToastMessage('Coming Soon');
  };

  const handleFavoritesClick = () => {
    showToastMessage('Coming Soon');
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      showToastMessage('Thank you for your feedback!');
      setFeedbackText('');
      setShowFeedbackSheet(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal - Slides up from bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300" dir="ltr">
        <div className="bg-[#F0F4F9] rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-[#F0F4F9] border-b border-[#E0E0E0]">
            <button
              onClick={onClose}
              className="text-[#333333] hover:bg-[#E0E0E0] p-2 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <p className="text-[#999999] text-xs font-normal flex-1 text-center">elsayed777x</p>
            <div className="w-10" />
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-8 pb-2">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-md">
                <span className="text-white text-4xl font-bold">E</span>
              </div>
              {/* Camera Icon Badge */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border-2 border-[#C9A84C] flex items-center justify-center shadow-md">
                <Camera className="w-3 h-3 text-[#C9A84C]" />
              </div>
            </div>

            {/* Greeting */}
            <p className="text-[#000000] text-xl font-bold mb-4 text-center">Welcome, elsayed777x</p>

            {/* Account Management Button */}
            <button className="px-6 py-2.5 rounded-full border border-[#DADADA] text-[#1A73E8] font-medium text-sm hover:bg-white transition-colors mb-6">
              Manage your Pi account
            </button>
          </div>

          {/* White Card 1 */}
          <div className="mx-4 mb-4 p-4 bg-white rounded-2xl border border-[#E0E0E0]">
            <div className="space-y-3">
              {/* Previous Chats */}
              <button 
                onClick={handlePreviousChatsClick}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Previous Chats</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Smart Context */}
              <button 
                onClick={handleSmartContextClick}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Smart Context</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Connected Apps */}
              <button 
                onClick={handleConnectedAppsClick}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Grid className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Connected Apps</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>
            </div>
          </div>

          {/* White Card 2 */}
          <div className="mx-4 mb-8 p-4 bg-white rounded-2xl border border-[#E0E0E0]">
            <div className="space-y-3">
              {/* My Orders */}
              <button 
                onClick={handleMyOrdersClick}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">My Orders</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Favorites */}
              <button 
                onClick={handleFavoritesClick}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Favorites</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Settings */}
              <button 
                onClick={() => setShowSettingsSheet(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Settings</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Feedback */}
              <button 
                onClick={() => setShowFeedbackSheet(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Feedback</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>

              {/* Help & Support */}
              <button 
                onClick={() => setShowHelpSheet(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#666666]" />
                  <span className="text-[#000000] font-medium text-sm">Help & Support</span>
                </div>
                <span className="text-[#999999]">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
          <div className="bg-[#333333] text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Settings Bottom Sheet */}
      {showSettingsSheet && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300"
            onClick={() => setShowSettingsSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#E0E0E0]">
                <div className="text-center flex-1">
                  <p className="text-[#000000] font-semibold">Settings</p>
                </div>
                <button
                  onClick={() => setShowSettingsSheet(false)}
                  className="text-[#333333] hover:bg-[#F5F5F5] p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-[#666666]" />
                    <span className="text-[#000000] font-medium">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      darkMode ? 'bg-[#C9A84C]' : 'bg-[#E0E0E0]'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-[#666666]" />
                    <span className="text-[#000000] font-medium">Notifications</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      notifications ? 'bg-[#C9A84C]' : 'bg-[#E0E0E0]'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Feedback Bottom Sheet */}
      {showFeedbackSheet && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300"
            onClick={() => setShowFeedbackSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#E0E0E0]">
                <div className="text-center flex-1">
                  <p className="text-[#000000] font-semibold">Feedback</p>
                </div>
                <button
                  onClick={() => setShowFeedbackSheet(false)}
                  className="text-[#333333] hover:bg-[#F5F5F5] p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full h-32 p-4 border border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#000000] placeholder-[#999999]"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="w-full bg-[#C9A84C] text-white font-medium py-3 rounded-lg hover:bg-[#B39A3F] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help & Support Bottom Sheet */}
      {showHelpSheet && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300"
            onClick={() => setShowHelpSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#E0E0E0]">
                <div className="text-center flex-1">
                  <p className="text-[#000000] font-semibold">Help & Support</p>
                </div>
                <button
                  onClick={() => setShowHelpSheet(false)}
                  className="text-[#333333] hover:bg-[#F5F5F5] p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* FAQ Items */}
              <div className="p-6 space-y-4">
                {[
                  { question: 'How to pay with Pi?', answer: 'You can pay with Pi Network cryptocurrency. Simply select Pi as your payment method at checkout.' },
                  { question: 'How to contact support?', answer: 'You can reach our support team 24/7 via email or through the support chat in the app.' },
                  { question: 'What is GlobalBusiness?', answer: 'GlobalBusiness is a comprehensive ecosystem for trading, shopping, and investing across platforms worldwide.' }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-[#F5F5F5] transition-colors">
                      <span className="text-[#000000] font-medium text-left">{faq.question}</span>
                      <ChevronDown className="h-5 w-5 text-[#666666]" />
                    </button>
                    <div className="px-4 pb-4 text-[#666666] text-sm border-t border-[#E0E0E0]">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
