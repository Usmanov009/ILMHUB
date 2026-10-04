import React from 'react';
import { TabType, Language } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  hasActiveCatchup?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  hasActiveCatchup = true
}) => {
  const tabs: { id: TabType; icon: string; labelUz: string; labelRu: string; labelEn: string; hasBadge?: boolean }[] = [
    { id: 'dashboard', icon: 'dashboard', labelUz: 'Asosiy', labelRu: 'Главная', labelEn: 'Home' },
    { id: 'schedule', icon: 'event_available', labelUz: 'Kundalik', labelRu: 'Дневник', labelEn: 'Schedule' },
    { id: 'lesson', icon: 'menu_book', labelUz: 'Darslar', labelRu: 'Уроки', labelEn: 'Lessons' },
    { id: 'recovery', icon: 'auto_mode', labelUz: 'Qoldirilgan', labelRu: 'Пропуски', labelEn: 'Catch-up', hasBadge: hasActiveCatchup },
    { id: 'aitutor', icon: 'smart_toy', labelUz: 'AI Ustoz', labelRu: 'ИИ Репетитор', labelEn: 'AI Tutor' },
    { id: 'growth', icon: 'trending_up', labelUz: 'Natijalar', labelRu: 'Прогресс', labelEn: 'Growth' },
    { id: 'profile', icon: 'person', labelUz: 'Profil', labelRu: 'Профиль', labelEn: 'Profile' }
  ];

  const getLabel = (tab: typeof tabs[0]) => {
    if (language === 'uz') return tab.labelUz;
    if (language === 'ru') return tab.labelRu;
    return tab.labelEn;
  };

  return (
    <>
      {/* Desktop Top Navigation Bar (Integrated below header on large screens) */}
      <nav className="hidden md:flex fixed top-16 left-0 right-0 z-40 bg-[#fcf8ff]/95 backdrop-blur-md border-b border-[#e8e6fe] shadow-xs">
        <div className="max-w-6xl mx-auto w-full px-8 flex items-center justify-start gap-1 py-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4244df] text-white shadow-sm'
                    : 'text-[#454555] hover:text-[#1a1a2b] hover:bg-[#efecff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {tab.icon}
                </span>
                <span>{getLabel(tab)}</span>
                {tab.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-[#fbd8f9] ring-2 ring-[#4244df] animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating Bottom Dock (Sticky PWA navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(66,68,223,0.08)] border-t border-[#c6c4d8]/40">
        <div className="h-16 px-1 flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 transition-all ${
                  isActive ? 'text-[#4244df] font-bold scale-105' : 'text-[#767587] hover:text-[#4244df]'
                }`}
              >
                {/* Ping notification badge for Catch-up */}
                {tab.hasBadge && (
                  <span className="absolute top-1 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbd8f9] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4244df]" />
                  </span>
                )}
                <span className="material-symbols-outlined text-[22px]">
                  {tab.icon}
                </span>
                <span className="text-[10px] mt-0.5 leading-tight tracking-tight font-display">
                  {getLabel(tab)}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#4244df] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
