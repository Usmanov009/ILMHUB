import React, { useState } from 'react';
import { Language, UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenProfile,
  unreadCount = 2
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: language === 'uz' ? 'Qoldirilgan darsni tiklash ochiq' : language === 'ru' ? 'Восстановление урока открыто' : 'Recovery session ready',
      desc: language === 'uz' ? 'Biologiya: Hujayra mitozi (6 daqiqa, +45 XP)' : language === 'ru' ? 'Биология: Митоз клетки (6 мин, +45 XP)' : 'Biology: Mitosis (6 min, +45 XP)',
      time: '10m',
      unread: true
    },
    {
      id: 'n2',
      title: language === 'uz' ? 'Fizika BSB-2 nazorati yaqinlashmoqda' : language === 'ru' ? 'Приближается БСБ-2 по физике' : 'Physics BSB-2 exam approaching',
      desc: language === 'uz' ? '22-Oktyabr: Optika va kvant fizikasi' : language === 'ru' ? '22 Октября: Оптика и квантовая физика' : 'Oct 22: Optics and Quantum Waves',
      time: '1h',
      unread: true
    }
  ];

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#fcf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(66,68,223,0.06)] border-b border-[#e8e6fe]">
      <div className="h-16 px-4 md:px-8 max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4244df] to-[#5d61f9] flex items-center justify-center text-white shadow-sm ring-2 ring-[#e1e0ff]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7.5 4.5 3.5 6.5 2 9.5V19C3.5 17.5 7.5 16.5 12 16.5C16.5 16.5 20.5 17.5 22 19V9.5C20.5 6.5 16.5 4.5 12 4.5Z" opacity="0.3"/>
              <path d="M12 3L14 7H10L12 3Z"/>
              <path d="M12 8V18M4 7.5C6.5 6 9.5 5.5 12 5.5C14.5 5.5 17.5 6 20 7.5V17.5C17.5 16 14.5 15.5 12 15.5C9.5 15.5 6.5 16 4 17.5V7.5Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a1a2b] font-display">
            Ilmhub
          </span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <div className="inline-flex items-center p-0.5 bg-[#efecff] rounded-full border border-[#c6c4d8]/40">
            <button
              onClick={() => onLanguageChange('uz')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                language === 'uz' ? 'bg-[#4244df] text-white shadow-sm' : 'text-[#454555] hover:text-[#1a1a2b]'
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                language === 'ru' ? 'bg-[#4244df] text-white shadow-sm' : 'text-[#454555] hover:text-[#1a1a2b]'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                language === 'en' ? 'bg-[#4244df] text-white shadow-sm' : 'text-[#454555] hover:text-[#1a1a2b]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Gamified Streak Pill */}
          <div className="flex items-center gap-1 bg-[#fbd8f9] text-[#4244df] px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(251,216,249,0.7)] border border-white/60">
            <span className="text-sm leading-none">🔥</span>
            <span className="text-xs font-bold font-display whitespace-nowrap tabular-nums">
              {user.streakDays}{language === 'uz' ? ' kun' : language === 'ru' ? ' д' : 'd'} • {user.xp} XP
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#454555] hover:text-[#4244df] hover:bg-[#efecff] transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4244df] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#e8e6fe] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#efecff]">
                  <span className="text-xs font-bold text-[#1a1a2b] font-display uppercase tracking-wider">
                    {language === 'uz' ? 'Bildirishnomalar' : language === 'ru' ? 'Уведомления' : 'Notifications'}
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#767587] hover:text-[#4244df]"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto no-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-[#f5f2ff] hover:bg-[#efecff] transition-colors flex flex-col gap-0.5 cursor-pointer"
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1a1a2b] line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-[#767587]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#454555] line-clamp-2">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={onOpenProfile}
            title={`${user.name} (${user.grade})`}
            className="flex items-center justify-center p-0.5 rounded-full bg-[#e1e0ff] ring-2 ring-[#4244df]/20 hover:ring-[#4244df] transition-all"
          >
            <img
              alt={user.name}
              src={user.avatarUrl}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
