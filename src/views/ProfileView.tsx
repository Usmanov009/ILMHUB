import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { playClickSound, playSuccessChime } from '../utils/sound';

interface ProfileViewProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'xp') => void;
}

const AVATAR_PRESETS = [
  {
    id: 'av1',
    name: 'Jasur (Asosiy)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfXH8Ei7wvYVvYihEDsiGoIj-A8xeplY_CT7ss14wWA0v1U8FoULjU6QfKsuC6Y_ysUKm45-cXw7wAJAWhIOPOcx7Iq4tF7qPq-RWdIPg1JR-OZblahrYf9PBdqx3vfbDKBwf-fxH878McKQst56HiMIxVeuGkdngb2ZlH4H6AD8rCIhl68fmbLTHyksQW26NJnBTg9lLKsTDdxkYIFjoNNSftqql0C6DD9IXEbP4LN8qGDheM1uvs'
  },
  {
    id: 'av2',
    name: 'Jasur (Quloqchinli)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbIhXV-9nUXxm-D95QxlQoLYSXfAWEzh91l_NMS4lJ3kjKwWiPImX9GlVn9_Ki-DxVPHG78H2uQ1PasF-m6vbywE2WujJyjpXNcMnzFfWQtRMaoMSk7VG8KCsp_jcHhYQ8OLHuob6OJiRVbS57fQE9ycH7U9jnepdnTHwhpivXXf6pJmNm0ZVP354oAiC16BCn3K19GUppFWEHS7PBW5CvctsEPAnF6UezJKi_G3MmfSrBPK1pPHVo'
  },
  {
    id: 'av3',
    name: 'Akademik Al-Xorazmiy',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALEy6mOpF23PJ58mgg7n92nxyldVwoduJYWfD_L2iwL7KAV4M6_HmK6zO13gq6gyqaBPpvjf_f696IK1c11wSt2Kx7lYCUY-Avn61YMPbQapbGsYjJoTrR1Jk6Xyr0XI0_XdlWi32WLz1mjPkuRSZE8OpKWsW_yZbsIJF3WiMHNOJGAYeGt9L4JPlU9KiEVPwcJkf5FfD_WmXiw-WRhTa6dQ_XPm6MkqcBGyBQEvX8U9AICrrefHMW'
  }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  language,
  onLanguageChange,
  onUpdateUser,
  onTriggerToast
}) => {
  // Profile edit states
  const [userName, setUserName] = useState(user.name);
  const [userGrade, setUserGrade] = useState(user.grade);
  const [schoolName, setSchoolName] = useState('174-sonli ixtisoslashtirilgan maktab (Toshkent)');
  const [parentPhone, setParentPhone] = useState('+998 (90) 123-45-67');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(45);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Notification toggles
  const [notifyMissed, setNotifyMissed] = useState(true);
  const [notifyBsb, setNotifyBsb] = useState(true);
  const [notifyAiTutor, setNotifyAiTutor] = useState(true);
  const [notifySmsParents, setNotifySmsParents] = useState(true);

  // Audio Voice preference
  const [aiVoiceRate, setAiVoiceRate] = useState<'normal' | 'slow' | 'fast'>('normal');

  const handleSaveProfile = () => {
    playSuccessChime();
    onUpdateUser({
      name: userName.trim() || user.name,
      grade: userGrade.trim() || user.grade
    });
    onTriggerToast(
      language === 'uz'
        ? 'Profil sozlamalari saqlandi ✓'
        : language === 'ru'
        ? 'Настройки профиля сохранены ✓'
        : 'Profile settings saved ✓',
      'success'
    );
  };

  const handleSelectAvatar = (url: string) => {
    playClickSound();
    onUpdateUser({ avatarUrl: url });
    setShowAvatarModal(false);
    onTriggerToast(
      language === 'uz' ? 'Profil rasmi yangilandi!' : 'Аватар обновлен!',
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Top Section Header */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#4244df] uppercase tracking-wider font-display">
            {language === 'uz' ? 'Shaxsiy Kabinet' : language === 'ru' ? 'Личный кабинет' : 'Personal Account'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1a2b] tracking-tight font-display">
            {language === 'uz' ? 'Profil & Sozlamalar' : language === 'ru' ? 'Профиль и Настройки' : 'Profile & Settings'}
          </h1>
        </div>
        <button
          onClick={handleSaveProfile}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4244df] hover:bg-[#5d61f9] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>{language === 'uz' ? 'Saqlash' : language === 'ru' ? 'Сохранить' : 'Save'}</span>
        </button>
      </section>

      {/* Main Student Card (Luminous Hero Card) */}
      <section className="relative overflow-hidden bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#e8e6fe] space-y-4">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#fbd8f9]/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#e1e0ff]/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with edit button */}
          <div className="relative">
            <img
              alt={user.name}
              src={user.avatarUrl}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-md ring-4 ring-[#e1e0ff]"
            />
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#4244df] text-white flex items-center justify-center shadow-lg hover:bg-[#5d61f9] active:scale-95 transition-all"
              title="Rasmni o'zgartirish"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#efecff] text-[#4244df] text-xs font-bold font-display">
              <span className="w-2 h-2 rounded-full bg-[#4244df]" />
              <span>ID: #ILM-2024-8841</span>
              <span>•</span>
              <span>{user.cohortName}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2b] font-display">
              {user.name}
            </h2>
            <p className="text-xs text-[#767587] font-medium">
              {user.grade} • {schoolName}
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="bg-[#f5f2ff] text-[#4244df] px-3 py-1 rounded-xl text-xs font-bold border border-[#e8e6fe] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                <span>Level {user.level} ({user.levelTitle})</span>
              </span>
              <span className="bg-[#fbd8f9] text-[#29132c] px-3 py-1 rounded-xl text-xs font-bold border border-white flex items-center gap-1">
                <span>🔥</span>
                <span>{user.streakDays} kunlik streak</span>
              </span>
              <span className="bg-[#e1e0ff] text-[#000e5f] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                <span>⭐</span>
                <span>{user.xp} XP</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Til va Mintaqa Sozlamalari (Language & Localization Card) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e1e0ff] flex items-center justify-center text-[#4244df]">
              <span className="material-symbols-outlined text-[20px]">translate</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Til va Mintaqa' : language === 'ru' ? 'Язык и Регион' : 'Language & Region'}
              </h3>
              <p className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'Dastur interfeysi va AI Ustoz tili' : 'Язык интерфейса и ИИ-репетитора'}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-[#fbd8f9] text-[#29132c] px-2 py-0.5 rounded-full font-bold">
            1-klikda yangilash
          </span>
        </div>

        {/* Language Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* O'zbekcha */}
          <button
            onClick={() => {
              playClickSound();
              onLanguageChange('uz');
            }}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center justify-between ${
              language === 'uz'
                ? 'bg-[#efecff] border-[#4244df] shadow-xs ring-1 ring-[#4244df]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] border-[#e8e6fe]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🇺🇿</span>
              <div>
                <span className="text-xs font-bold text-[#1a1a2b] block">O'zbekcha</span>
                <span className="text-[10px] text-[#767587]">Lotin alifbosida</span>
              </div>
            </div>
            {language === 'uz' && (
              <span className="material-symbols-outlined text-[18px] text-[#4244df]">check_circle</span>
            )}
          </button>

          {/* Русский */}
          <button
            onClick={() => {
              playClickSound();
              onLanguageChange('ru');
            }}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center justify-between ${
              language === 'ru'
                ? 'bg-[#efecff] border-[#4244df] shadow-xs ring-1 ring-[#4244df]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] border-[#e8e6fe]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🇷🇺</span>
              <div>
                <span className="text-xs font-bold text-[#1a1a2b] block">Русский</span>
                <span className="text-[10px] text-[#767587]">Кириллица</span>
              </div>
            </div>
            {language === 'ru' && (
              <span className="material-symbols-outlined text-[18px] text-[#4244df]">check_circle</span>
            )}
          </button>

          {/* English */}
          <button
            onClick={() => {
              playClickSound();
              onLanguageChange('en');
            }}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center justify-between ${
              language === 'en'
                ? 'bg-[#efecff] border-[#4244df] shadow-xs ring-1 ring-[#4244df]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] border-[#e8e6fe]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🇬🇧</span>
              <div>
                <span className="text-xs font-bold text-[#1a1a2b] block">English</span>
                <span className="text-[10px] text-[#767587]">Global curriculum</span>
              </div>
            </div>
            {language === 'en' && (
              <span className="material-symbols-outlined text-[18px] text-[#4244df]">check_circle</span>
            )}
          </button>
        </div>

        {/* AI Voice speed selector */}
        <div className="p-3 bg-[#f5f2ff] rounded-2xl border border-[#e8e6fe] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4244df]">record_voice_over</span>
            <span className="font-semibold text-[#1a1a2b]">
              {language === 'uz' ? 'AI Repetitor ovoz tezligi' : 'Скорость голоса ИИ-репетитора'}:
            </span>
          </div>
          <div className="flex gap-1">
            {(['slow', 'normal', 'fast'] as const).map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  playClickSound();
                  setAiVoiceRate(rate);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  aiVoiceRate === rate
                    ? 'bg-[#4244df] text-white shadow-xs'
                    : 'bg-white text-[#454555] hover:bg-[#efecff]'
                }`}
              >
                {rate === 'slow' ? '0.8x' : rate === 'normal' ? '1.0x' : '1.2x'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* O'quvchi ma'lumotlarini tahrirlash (Edit Student Profile Data) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#dfe0ff] flex items-center justify-center text-[#000e5f]">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Shaxsiy Ma\'lumotlar' : 'Личные данные'}
            </h3>
            <p className="text-[11px] text-[#767587]">
              {language === 'uz' ? 'Ism, maktab va bog\'lanish raqamlari' : 'Имя, класс и контактные данные'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#454555] font-semibold block">O'quvchi ismi:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#f5f2ff] text-[#1a1a2b] p-2.5 rounded-xl border border-[#e8e6fe] outline-none focus:ring-2 focus:ring-[#4244df]/30 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#454555] font-semibold block">Sinf va guruh:</label>
            <input
              type="text"
              value={userGrade}
              onChange={(e) => setUserGrade(e.target.value)}
              className="w-full bg-[#f5f2ff] text-[#1a1a2b] p-2.5 rounded-xl border border-[#e8e6fe] outline-none focus:ring-2 focus:ring-[#4244df]/30 font-semibold"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[#454555] font-semibold block">Maktab nomi:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-[#f5f2ff] text-[#1a1a2b] p-2.5 rounded-xl border border-[#e8e6fe] outline-none focus:ring-2 focus:ring-[#4244df]/30"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[#454555] font-semibold block">
              Ota-ona telefon raqami (Kundalik hisobotlar uchun):
            </label>
            <input
              type="text"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="w-full bg-[#f5f2ff] text-[#1a1a2b] p-2.5 rounded-xl border border-[#e8e6fe] outline-none focus:ring-2 focus:ring-[#4244df]/30 font-mono"
            />
          </div>
        </div>
      </section>

      {/* Ta'lim Maqsadlari (Learning Targets) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fbd8f9] flex items-center justify-center text-[#4244df]">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Kunlik Ta\'lim Maqsadi' : 'Ежедневная цель обучения'}
              </h3>
              <p className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'Kuniga rejalashtirilgan o\'rganish vaqti' : 'Запланированное время занятий'}
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#4244df] tabular-nums bg-[#e1e0ff] px-2.5 py-1 rounded-full">
            {dailyGoalMinutes} daqiqa / kun
          </span>
        </div>

        <div className="space-y-2 bg-[#f5f2ff] p-3.5 rounded-2xl border border-[#e8e6fe]">
          <input
            type="range"
            min="15"
            max="120"
            step="5"
            value={dailyGoalMinutes}
            onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value))}
            className="w-full accent-[#4244df] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#767587] font-semibold">
            <span>15 daqiqa (Yengil)</span>
            <span>45 daqiqa (Optimal)</span>
            <span>120 daqiqa (Intensiv)</span>
          </div>
        </div>
      </section>

      {/* Bildirishnomalar va Eslatmalar (Notification Preferences) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#efecff] flex items-center justify-center text-[#4244df]">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Bildirishnoma & Ogohlantirishlar' : 'Уведомления и напоминания'}
            </h3>
            <p className="text-[11px] text-[#767587]">
              {language === 'uz' ? 'Darslar va nazorat ishlari haqida xabardorlik' : 'Контроль важных событий'}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {/* Missed class alerts */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
            <div>
              <span className="font-bold text-[#1a1a2b] block">Qoldirilgan darslarni tiklash eslatmasi</span>
              <span className="text-[11px] text-[#767587]">Dars qoldirilganda 6 daqiqalik modulni taklif qilish</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setNotifyMissed(!notifyMissed);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifyMissed ? 'bg-[#4244df]' : 'bg-[#c6c4d8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notifyMissed ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* BSB/CHSB alerts */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
            <div>
              <span className="font-bold text-[#1a1a2b] block">BSB va CHSB oraliq nazorati eslatmasi</span>
              <span className="text-[11px] text-[#767587]">Imtihonga 3 kun qolganda tayyorgarlik testlari</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setNotifyBsb(!notifyBsb);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifyBsb ? 'bg-[#4244df]' : 'bg-[#c6c4d8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notifyBsb ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* AI Tutor alerts */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
            <div>
              <span className="font-bold text-[#1a1a2b] block">AI Ustoz kundalik tahliliy xabarlari</span>
              <span className="text-[11px] text-[#767587]">Uy vazifalariga oid xatolarni tahlil qilish</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setNotifyAiTutor(!notifyAiTutor);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifyAiTutor ? 'bg-[#4244df]' : 'bg-[#c6c4d8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notifyAiTutor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Parents SMS */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
            <div>
              <span className="font-bold text-[#1a1a2b] block">Ota-onaga haftalik elektron hisobot</span>
              <span className="text-[11px] text-[#767587]">Haftalik baholar va davomat SMS orqali</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setNotifySmsParents(!notifySmsParents);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifySmsParents ? 'bg-[#4244df]' : 'bg-[#c6c4d8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notifySmsParents ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Yutuqlar va Nishonlar (Achievements Showcase) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fbd8f9] flex items-center justify-center text-[#4244df]">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Qo\'lga Kiritilgan Nishonlar' : 'Достижения и бейджи'}
              </h3>
              <p className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'Akademik va gamifikatsiya yutuqlari' : 'Академические награды'}
              </p>
            </div>
          </div>
          <span className="text-xs text-[#4244df] font-bold">5 / 8 Ochiq</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-2xl bg-[#efecff] border border-[#e8e6fe] text-center space-y-1">
            <div className="text-2xl">⚡</div>
            <span className="font-bold text-[#1a1a2b] block truncate">Lightning Catch-up</span>
            <span className="text-[10px] text-[#767587]">Darsni 6m da tiklagan</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#efecff] border border-[#e8e6fe] text-center space-y-1">
            <div className="text-2xl">🔥</div>
            <span className="font-bold text-[#1a1a2b] block truncate">14-Day Streak</span>
            <span className="text-[10px] text-[#767587]">Uzluksiz ta'lim</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#efecff] border border-[#e8e6fe] text-center space-y-1">
            <div className="text-2xl">🔬</div>
            <span className="font-bold text-[#1a1a2b] block truncate">Quantum Scholar</span>
            <span className="text-[10px] text-[#767587]">Fizikadan 100/100</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe] text-center space-y-1 opacity-70">
            <div className="text-2xl">🏆</div>
            <span className="font-bold text-[#767587] block truncate">Gold Honor Roll</span>
            <span className="text-[10px] text-[#767587]">I-Chorak 5.0 GPA</span>
          </div>
        </div>
      </section>

      {/* Integratsiyalar va Tizimdan Chiqish (Integrations & Logout) */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-[#4244df]">hub</span>
            <div>
              <span className="text-xs font-bold text-[#1a1a2b] block">e-Maktab (Kundalik.com) integratsiyasi</span>
              <span className="text-[10px] text-[#767587]">Sinxronizatsiya holati: Faol va yangilangan</span>
            </div>
          </div>
          <span className="text-[10px] bg-[#e1e0ff] text-[#4244df] font-bold px-2 py-0.5 rounded-full">
            Ulangan ✓
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              playSuccessChime();
              onTriggerToast(
                language === 'uz' ? 'Tizim kesh ma\'lumotlari tozalandi!' : 'Кэш обновлен!',
                'info'
              );
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-[#efecff] hover:bg-[#e8e6fe] text-[#4244df] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">cached</span>
            <span>{language === 'uz' ? 'Keshni Yangilash' : 'Обновить кэш'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              if (window.confirm(language === 'uz' ? 'Haqiqatan ham profildan chiqmoqchimisiz?' : 'Вы действительно хотите выйти?')) {
                onTriggerToast(
                  language === 'uz' ? 'Tizimdan muvaffaqiyatli chiqildi.' : 'Вы вышли из системы.',
                  'info'
                );
              }
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>{language === 'uz' ? 'Tizimdan Chiqish' : 'Выйти из аккаунта'}</span>
          </button>
        </div>
      </section>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 border border-[#c6c4d8]/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                Profil Rasmini Tanlang
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f5f2ff] flex items-center justify-center text-[#767587]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {AVATAR_PRESETS.map((av) => (
                <div
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.url)}
                  className={`p-2 rounded-2xl text-center space-y-1.5 cursor-pointer border transition-all ${
                    user.avatarUrl === av.url
                      ? 'border-[#4244df] bg-[#efecff] scale-105 shadow-sm'
                      : 'border-[#e8e6fe] bg-[#f5f2ff] hover:bg-[#efecff]'
                  }`}
                >
                  <img
                    alt={av.name}
                    src={av.url}
                    className="w-16 h-16 rounded-2xl object-cover mx-auto"
                  />
                  <span className="text-[10px] font-bold text-[#1a1a2b] block truncate">
                    {av.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
