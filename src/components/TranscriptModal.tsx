import React, { useState } from 'react';
import { TRANSCRIPT_ITEMS } from '../data/mockData';
import { Language } from '../types';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState(0);

  if (!isOpen) return null;

  const filtered = TRANSCRIPT_ITEMS.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1a1a2b] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#c6c4d8]/40">
        <div className="p-4 bg-[#efecff] border-b border-[#e3e0f8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4244df]">subtitles</span>
            <div>
              <span className="text-[10px] font-bold text-[#4244df] uppercase tracking-wider block font-display">
                {language === 'uz' ? 'Jonli Sinxron Transkript' : 'Синхронизированная транскрипция'}
              </span>
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Kvant optikasi: 4K Hujjatli film' : 'Квантовая оптика: 4K Фильм'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#767587]"
          >
            ✕
          </button>
        </div>

        {/* Search filter */}
        <div className="p-3 bg-[#f5f2ff] border-b border-[#e3e0f8]">
          <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-[#e3e0f8] gap-2">
            <span className="material-symbols-outlined text-[#767587] text-[18px]">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'uz' ? 'Transkriptdan so\'z qidirish...' : 'Поиск по транскрипции...'}
              className="w-full bg-transparent text-xs text-[#1a1a2b] outline-none"
            />
          </div>
        </div>

        {/* Transcript items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveItem(index)}
              className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                activeItem === index
                  ? 'bg-[#efecff] border-[#4244df]/40 shadow-xs'
                  : 'bg-[#f5f2ff] border-transparent hover:bg-[#efecff]/60'
              }`}
            >
              <span className="px-2 py-0.5 rounded-md bg-[#4244df] text-white text-[10px] font-bold shrink-0 tabular-nums">
                {item.time}
              </span>
              <p className="text-xs text-[#1a1a2b] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
