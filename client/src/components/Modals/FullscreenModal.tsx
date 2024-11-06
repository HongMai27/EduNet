import React from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-6xl w-full p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold"
        >
          ×
        </button>
        <div className="w-full h-auto max-h-screen object-contain rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
