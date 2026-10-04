import React, { useState } from 'react';
import { Language, TabType } from '../types';
import { playClickSound, playSuccessChime } from '../utils/sound';

interface SubjectMasteryBadgesProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  hasActiveCatchup: boolean;
}

export type MasteryTier = 'diamond' | 'gold' | 'silver' | 'bronze';

export interface SubjectMastery {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  icon: string;
  badgeTitleUz: string;
  badgeTitleRu: string;
  badgeTitleEn: string;
  completedLessons: number;
  totalLessons: number;
  colorClass: string;
  glowColor: string;
  perksUz: string[];
  perksRu: string[];
  perksEn: string[];
}

export const SUBJECT_MASTERIES: SubjectMastery[] = [
  {
    id: 'math',
    nameUz: 'Matematika (Algebra)',
    nameRu: 'Математика (Алгебра)',
    nameEn: 'Mathematics (Algebra)',
    icon: 'calculate',
    badgeTitleUz: 'Cheksizlik Me\'mori (Infinity Architect)',
    badgeTitleRu: 'Архитектор Бесконечности',
    badgeTitleEn: 'Infinity Architect',
    completedLessons: 24,
    totalLessons: 25,
    colorClass: 'bg-[#4454bb]',
    glowColor: 'shadow-[0_0_18px_rgba(66,68,223,0.35)]',
    perksUz: ['+25% XP bonus har bir masalada', 'Olimpiada arenasi ochiq', 'Maxsus "Grandmaster" ramkasi'],
    perksRu: ['+25% XP за решение задач', 'Доступ к арене олимпиад', 'Рамка "Grandmaster"'],
    perksEn: ['+25% XP boost per task', 'Olympiad arena unlocked', 'Grandmaster crest profile frame']
  },
  {
    id: 'phys',
    nameUz: 'Fizika (Kvant & Optika)',
    nameRu: 'Физика (Кванты & Оптика)',
    nameEn: 'Physics (Quantum & Optics)',
    icon: 'science',
    badgeTitleUz: 'Kvant Olimi (Quantum Scholar)',
    badgeTitleRu: 'Квантовый Ученый',
    badgeTitleEn: 'Quantum Scholar',
    completedLessons: 21,
    totalLessons: 24,
    colorClass: 'bg-[#4244df]',
    glowColor: 'shadow-[0_0_16px_rgba(255,215,0,0.35)]',
    perksUz: ['Fizika duellari uchun 1.5x ochko', 'Laboratoriya 4K transkriptlari', 'Ustoz Shavkatova bilan bevosita aloqa'],
    perksRu: ['1.5x очков в дуэлях физиков', '4K видео-транскрипции', 'Прямая связь с учителем'],
    perksEn: ['1.5x score in Physics Duels', '4K documentary transcripts', 'Direct teacher office pass']
  },
  {
    id: 'chem',
    nameUz: 'Kimyo (Molekulyar)',
    nameRu: 'Химия (Молекулярная)',
    nameEn: 'Chemistry (Molecular)',
    icon: 'biotech',
    badgeTitleUz: 'Molekulyar Donishmand (Molecular Sage)',
    badgeTitleRu: 'Мастер Молекул',
    badgeTitleEn: 'Molecular Sage',
    completedLessons: 17,
    totalLessons: 21,
    colorClass: 'bg-[#5d61f9]',
    glowColor: 'shadow-[0_0_16px_rgba(255,215,0,0.25)]',
    perksUz: ['Kimyoviy formulalar AI tekshiruvi', 'BSB-1 tajribalar kutubxonasi', 'Oraliq nazorat test shablonlari'],
    perksRu: ['ИИ-проверка химических реакций', 'Библиотека опытов БСБ', 'Тестовые шаблоны'],
    perksEn: ['AI reaction analyzer', 'BSB experiment vault', 'Exam study templates']
  },
  {
    id: 'bio',
    nameUz: 'Biologiya (Sitologiya)',
    nameRu: 'Биология (Цитология)',
    nameEn: 'Biology (Cytology)',
    icon: 'psychology',
    badgeTitleUz: 'Hujayra Tadqiqotchisi (Bio Explorer)',
    badgeTitleRu: 'Исследователь Клеток',
    badgeTitleEn: 'Bio Explorer',
    completedLessons: 14,
    totalLessons: 20,
    colorClass: 'bg-[#886b88]',
    glowColor: 'shadow-[0_0_16px_rgba(192,192,192,0.3)]',
    perksUz: ['6 daqiqalik ekspress tiklash rejimi', 'Mitoz interaktiv 3D mikroskop', '+10 XP har bir biologiya testida'],
    perksRu: ['Режим экспресс-восстановления', 'Интерактивный микроскоп митоза', '+10 XP за каждый тест'],
    perksEn: ['6-minute fast-track recovery', 'Interactive 3D mitosis view', '+10 XP per biology checkpoint']
  },
  {
    id: 'eng',
    nameUz: 'Ingliz tili (IELTS Prep)',
    nameRu: 'Английский (IELTS)',
    nameEn: 'English (IELTS Prep)',
    icon: 'language',
    badgeTitleUz: 'Ritorika Ustasi (Fluent Orator)',
    badgeTitleRu: 'Мастер Речи',
    badgeTitleEn: 'Fluent Orator',
    completedLessons: 22,
    totalLessons: 24,
    colorClass: 'bg-[#2928ca]',
    glowColor: 'shadow-[0_0_16px_rgba(255,215,0,0.35)]',
    perksUz: ['Speaking AI audio tekshiruvi', 'Reading Skimming metodlari', 'CEFR B2+ sertifikat yo\'riqnomasi'],
    perksRu: ['ИИ-оценка устной речи', 'Методики быстрого чтения', 'Инструкции к сертификату B2+'],
    perksEn: ['AI pronunciation grader', 'Skimming speed drills', 'CEFR B2+ study guide']
  },
  {
    id: 'cs',
    nameUz: 'Informatika (Python OOP)',
    nameRu: 'Информатика (Python)',
    nameEn: 'CompSci (Python OOP)',
    icon: 'terminal',
    badgeTitleUz: 'Kod Shogirdi (Code Initiate)',
    badgeTitleRu: 'Инициат Кода',
    badgeTitleEn: 'Code Initiate',
    completedLessons: 13,
    totalLessons: 22,
    colorClass: 'bg-[#1a1a2b]',
    glowColor: 'shadow-[0_0_14px_rgba(205,127,50,0.35)]',
    perksUz: ['Kodni avtomatik sintaksis tekshiruv', 'Python class namunalari', 'IT zalga navbatsiz kirish'],
    perksRu: ['Автопроверка синтаксиса кода', 'Шаблоны классов Python', 'Приоритет в IT-зале'],
    perksEn: ['Automated syntax linter', 'Python class blueprints', 'Lab access pass']
  }
];

export const getMasteryTier = (completed: number, total: number): {
  tier: MasteryTier;
  labelUz: string;
  labelRu: string;
  labelEn: string;
  symbol: string;
  tierBadgeClass: string;
  borderBadgeClass: string;
  ringClass: string;
} => {
  const percent = Math.round((completed / total) * 100);
  if (percent >= 95) {
    return {
      tier: 'diamond',
      labelUz: 'Diamond • Kvant',
      labelRu: 'Diamond • Квант',
      labelEn: 'Diamond • Elite',
      symbol: '💎',
      tierBadgeClass: 'bg-gradient-to-r from-[#e1e0ff] via-[#fbd8f9] to-[#c0c1ff] text-[#05006c]',
      borderBadgeClass: 'border-[#4244df] shadow-[0_0_16px_rgba(66,68,223,0.35)]',
      ringClass: 'ring-2 ring-[#4244df]'
    };
  }
  if (percent >= 80) {
    return {
      tier: 'gold',
      labelUz: 'Gold • A\'lo',
      labelRu: 'Gold • Отлично',
      labelEn: 'Gold • Scholar',
      symbol: '🥇',
      tierBadgeClass: 'bg-[#fff5c0] text-[#7a5800]',
      borderBadgeClass: 'border-[#f59e0b] shadow-[0_0_14px_rgba(245,158,11,0.3)]',
      ringClass: 'ring-2 ring-[#f59e0b]'
    };
  }
  if (percent >= 65) {
    return {
      tier: 'silver',
      labelUz: 'Silver • Usta',
      labelRu: 'Silver • Мастер',
      labelEn: 'Silver • Proficient',
      symbol: '🥈',
      tierBadgeClass: 'bg-[#f1f5f9] text-[#334155]',
      borderBadgeClass: 'border-[#94a3b8] shadow-sm',
      ringClass: 'ring-2 ring-[#94a3b8]'
    };
  }
  return {
    tier: 'bronze',
    labelUz: 'Bronze • Shogird',
    labelRu: 'Bronze • Ученик',
    labelEn: 'Bronze • Apprentice',
    symbol: '🥉',
    tierBadgeClass: 'bg-[#ffedd5] text-[#9a3412]',
    borderBadgeClass: 'border-[#f97316] shadow-sm',
    ringClass: 'ring-2 ring-[#f97316]'
  };
};

export const SubjectMasteryBadges: React.FC<SubjectMasteryBadgesProps> = ({
  language,
  onNavigateTab,
  hasActiveCatchup
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectMastery | null>(null);
  const [filterTier, setFilterTier] = useState<'all' | MasteryTier>('all');

  const getSubjectName = (sub: SubjectMastery) => {
    if (language === 'uz') return sub.nameUz;
    if (language === 'ru') return sub.nameRu;
    return sub.nameEn;
  };

  const getBadgeTitle = (sub: SubjectMastery) => {
    if (language === 'uz') return sub.badgeTitleUz;
    if (language === 'ru') return sub.badgeTitleRu;
    return sub.badgeTitleEn;
  };

  const getPerks = (sub: SubjectMastery) => {
    if (language === 'uz') return sub.perksUz;
    if (language === 'ru') return sub.perksRu;
    return sub.perksEn;
  };

  const filtered = SUBJECT_MASTERIES.filter((sub) => {
    if (filterTier === 'all') return true;
    const completed = sub.id === 'bio' && !hasActiveCatchup ? sub.completedLessons + 1 : sub.completedLessons;
    const tierInfo = getMasteryTier(completed, sub.totalLessons);
    return tierInfo.tier === filterTier;
  });

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#fbd8f9]/50 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#e1e0ff] text-[#4244df] flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[20px]">military_tech</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
                {language === 'uz'
                  ? 'Fanlar Bo\'yicha Mastery Nishonlari'
                  : language === 'ru'
                  ? 'Бейджи Мастерства по Предметам'
                  : 'Subject Mastery Badges'}
              </h3>
              <span className="bg-[#fbd8f9] text-[#29132c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Tier Tizimi
              </span>
            </div>
            <p className="text-[11px] text-[#767587]">
              {language === 'uz'
                ? 'Darslarni yakunlash darajasiga qarab nishonlar va darajalar (Tiers) oling'
                : 'Зарабатывайте уровни мастерства за прохождение уроков'}
            </p>
          </div>
        </div>

        {/* Tier filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'diamond', label: '💎 Diamond' },
            { id: 'gold', label: '🥇 Gold' },
            { id: 'silver', label: '🥈 Silver' },
            { id: 'bronze', label: '🥉 Bronze' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                playClickSound();
                setFilterTier(f.id as typeof filterTier);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                filterTier === f.id
                  ? 'bg-[#4244df] text-white shadow-xs'
                  : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#454555]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Subject Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((sub) => {
          const completed = sub.id === 'bio' && !hasActiveCatchup ? sub.completedLessons + 1 : sub.completedLessons;
          const percent = Math.round((completed / sub.totalLessons) * 100);
          const tierInfo = getMasteryTier(completed, sub.totalLessons);

          return (
            <div
              key={sub.id}
              onClick={() => {
                playSuccessChime();
                setSelectedSubject(sub);
              }}
              className={`p-3.5 rounded-2xl bg-[#faf8ff] hover:bg-[#f5f2ff] border transition-all cursor-pointer relative group flex flex-col justify-between space-y-3 ${tierInfo.borderBadgeClass}`}
            >
              {/* Top Row: Icon + Tier Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${sub.colorClass} flex items-center justify-center text-white shadow-xs shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">{sub.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1a2b] font-display line-clamp-1">
                      {getSubjectName(sub)}
                    </h4>
                    <span className="text-[10px] text-[#767587] line-clamp-1">
                      {getBadgeTitle(sub)}
                    </span>
                  </div>
                </div>

                {/* Tier Badge Pill */}
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-xs ${tierInfo.tierBadgeClass}`}>
                  <span>{tierInfo.symbol}</span>
                  <span className="hidden min-[400px]:inline">{tierInfo.tier.toUpperCase()}</span>
                </span>
              </div>

              {/* Progress Track */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#767587]">
                    {completed} / {sub.totalLessons} {language === 'uz' ? 'dars' : 'уроков'}
                  </span>
                  <span className="text-[#4244df] font-bold tabular-nums">
                    {percent}%
                  </span>
                </div>
                <div className="w-full bg-[#e3e0f8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tierInfo.tier === 'diamond'
                        ? 'bg-gradient-to-r from-[#4244df] via-[#8393fe] to-[#fbd8f9]'
                        : tierInfo.tier === 'gold'
                        ? 'bg-[#f59e0b]'
                        : tierInfo.tier === 'silver'
                        ? 'bg-[#64748b]'
                        : 'bg-[#f97316]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Card Footer hint */}
              <div className="flex items-center justify-between pt-1 border-t border-[#e8e6fe] text-[10px] text-[#767587]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#4244df]">workspace_premium</span>
                  <span>Imtiyozlarni ko'rish</span>
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#4244df] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Subject Mastery Details & Unlocked Perks */}
      {selectedSubject && (() => {
        const completed = selectedSubject.id === 'bio' && !hasActiveCatchup ? selectedSubject.completedLessons + 1 : selectedSubject.completedLessons;
        const percent = Math.round((completed / selectedSubject.totalLessons) * 100);
        const tierInfo = getMasteryTier(completed, selectedSubject.totalLessons);
        const perks = getPerks(selectedSubject);
        const nextTarget = percent < 65 ? 65 : percent < 80 ? 80 : percent < 95 ? 95 : 100;
        const remainingForNext = Math.max(0, Math.ceil((nextTarget / 100) * selectedSubject.totalLessons) - completed);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-[#1a1a2b] rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 border border-[#c6c4d8]/40 relative overflow-hidden">
              {/* Top ambient glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#fbd8f9]/50 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${selectedSubject.colorClass} flex items-center justify-center text-white`}>
                    <span className="material-symbols-outlined text-[18px]">{selectedSubject.icon}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                    {getSubjectName(selectedSubject)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#f5f2ff] flex items-center justify-center text-[#767587]"
                >
                  ✕
                </button>
              </div>

              {/* Big Tier Emblem Showcase */}
              <div className="p-4 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe] text-center space-y-2 relative">
                <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-white bg-white">
                  {tierInfo.symbol}
                </div>
                <div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${tierInfo.tierBadgeClass}`}>
                    {tierInfo.labelUz}
                  </span>
                  <h4 className="text-sm font-bold text-[#1a1a2b] font-display mt-2">
                    {getBadgeTitle(selectedSubject)}
                  </h4>
                  <p className="text-[11px] text-[#767587]">
                    {completed} / {selectedSubject.totalLessons} dars yakunlangan ({percent}%)
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#e3e0f8] h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#4244df] h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {percent < 95 && (
                  <p className="text-[10px] text-[#4244df] font-bold">
                    Keyingi tier darajasiga chiqish uchun yana {remainingForNext} ta dars qoldi!
                  </p>
                )}
              </div>

              {/* Unlocked Perks List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#454555] uppercase tracking-wider block font-display">
                  Qo'lga Kiritilgan Imtiyozlar (Perks):
                </span>
                <div className="space-y-1.5">
                  {perks.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#faf8ff] rounded-xl border border-[#e8e6fe] text-xs">
                      <span className="material-symbols-outlined text-[16px] text-[#4244df]">verified</span>
                      <span className="text-[#1a1a2b] font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    onNavigateTab(selectedSubject.id === 'phys' ? 'lesson' : selectedSubject.id === 'bio' ? 'recovery' : 'schedule');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#4244df] hover:bg-[#5d61f9] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">play_lesson</span>
                  <span>Darsni Davom Ettirish</span>
                </button>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#efecff] text-[#454555] hover:bg-[#e8e6fe] text-xs font-semibold"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
