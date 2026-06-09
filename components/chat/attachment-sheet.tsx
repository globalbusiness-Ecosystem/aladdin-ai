'use client';

import { useRef, useState } from 'react';
import { Camera, Image, FileText, HardDrive, FileQuestion } from 'lucide-react';

interface AttachmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File, type: 'image' | 'document' | 'location') => void;
}

export function AttachmentSheet({
  isOpen,
  onClose,
  onFileSelected
}: AttachmentSheetProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string>('');

  // Handle camera file selection
  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file, 'image');
      onClose();
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  // Handle photo library file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file, 'image');
      onClose();
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  // Handle document file selection
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file, 'document');
      onClose();
    }
    if (docInputRef.current) {
      docInputRef.current.value = '';
    }
  };

  // Show toast notification
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
    onClose();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handlePhotoLibraryClick = () => {
    photoInputRef.current?.click();
  };

  const handleDocumentClick = () => {
    docInputRef.current?.click();
  };

  if (!isOpen) return null;

  const options = [
    { id: 'camera', icon: Camera, label: 'الكاميرا', onClick: handleCameraClick },
    { id: 'photos', icon: Image, label: 'معرض الصور', onClick: handlePhotoLibraryClick },
    { id: 'files', icon: FileText, label: 'الملفات', onClick: handleDocumentClick },
    { id: 'drive', icon: HardDrive, label: 'Google Drive', onClick: () => showToast('Coming Soon') },
    { id: 'notes', icon: FileQuestion, label: 'المفكرة', onClick: () => showToast('Coming Soon') }
  ];

  return (
    <>
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        style={{ display: 'none' }}
      />
      <input
        ref={photoInputRef}
        id="photoInput"
        type="file"
        accept="image/*,video/*"
        onChange={handlePhotoChange}
        style={{ display: 'none' }}
      />
      <input
        ref={docInputRef}
        id="docInput"
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={handleDocChange}
        style={{ display: 'none' }}
      />

      {/* Backdrop with dark blur */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto flex justify-center">
          <div className="w-full bg-white rounded-t-[24px] shadow-2xl">
            {/* Gray Handle Bar */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 bg-[#E0E0E0] rounded-full" />
            </div>

            {/* Vertical List of Options */}
            <div className="divide-y divide-[#F0F0F0]">
              {options.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className="w-full h-14 flex items-center justify-end px-4 hover:bg-[#F9F9F9] active:bg-[#F0F0F0] transition-colors duration-150"
                >
                  {/* Text on right */}
                  <span className="text-base text-[#111] font-medium ml-4">
                    {option.label}
                  </span>
                  {/* Icon on right */}
                  <option.icon className="w-6 h-6 text-[#666] flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Bottom padding */}
            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#323232] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
