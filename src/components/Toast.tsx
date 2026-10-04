import React from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'info' | 'xp';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, type = 'success' }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="bg-[#2f2f41] text-[#f2efff] p-3.5 rounded-xl shadow-2xl flex items-center justify-between border border-[#4244df]/30 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <span className="material-symbols-outlined text-[#fbd8f9] text-[22px]">
            {type === 'xp' ? 'bolt' : type === 'info' ? 'info' : 'celebration'}
          </span>
          <span className="text-sm font-semibold tracking-tight">{message}</span>
        </div>
        <span className="text-xs bg-[#4244df] text-white px-2 py-0.5 rounded-full font-bold">
          Ilmhub
        </span>
      </div>
    </div>
  );
};
