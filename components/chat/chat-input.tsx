'use client';

import { Send, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onMicClick?: () => void;
  onAttachmentClick?: () => void;
  isLoading: boolean;
  prefillMessage?: string;
}

export function ChatInput({
  inputValue,
  onInputChange,
  onSend,
  onMicClick,
  onAttachmentClick,
  isLoading,
  prefillMessage
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && (prefillMessage || inputValue.trim())) {
      e.preventDefault();
      onSend();
    }
  };

  const isDisabled = isLoading || (!prefillMessage && !inputValue.trim());

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 py-4 flex justify-center pointer-events-none">
      <div className="w-full max-w-3xl pointer-events-auto">
        {/* Floating Input Bar with Enhanced Effects */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-[#0A0A0A]/90 to-[#0F0F0F]/90 rounded-full border border-[#D4AF37]/30 p-2 flex items-center gap-2 shadow-2xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 transition-all duration-200">
          {/* Plus Button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onAttachmentClick}
            className="text-[#D4AF37] hover:bg-[#1a1a1a] hover:text-[#E8C547] rounded-full flex-shrink-0 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Mic Button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onMicClick}
            className="text-[#D4AF37] hover:bg-[#1a1a1a] hover:text-[#E8C547] rounded-full flex-shrink-0 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Input Field */}
          <Input
            value={prefillMessage || inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aladdin anything..."
            className="bg-transparent border-0 text-white placeholder:text-[#666666] focus:ring-0 text-base flex-1 font-medium"
            disabled={isLoading}
            autoComplete="off"
          />

          {/* Send Button */}
          <Button
            onClick={onSend}
            className="bg-gradient-to-r from-[#D4AF37] to-[#E8C547] hover:from-[#E8C547] hover:to-[#F0D857] text-[#0A0A0A] rounded-full flex-shrink-0 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60"
            size="icon"
            disabled={isDisabled}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
