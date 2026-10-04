import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, Language, TabType } from '../types';
import { playClickSound, playSuccessChime } from '../utils/sound';
import { SubjectMasteryBadges } from '../components/SubjectMasteryBadges';

interface DashboardViewProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenRecovery: () => void;
  hasActiveCatchup: boolean;
  onAskAiTopic: (topic: string) => void;
  onEarnXp?: (amount: number, reason?: string) => void;
}

interface DailyGoalTopic {
  id: string;
  subject: string;
  title: string;
  durationMin: number;
  completed: boolean;
  icon: string;
  colorClass: string;
  tag: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  language,
  onLanguageChange,
  onNavigateTab,
  onOpenRecovery,
  hasActiveCatchup,
  onAskAiTopic,
  onEarnXp
}) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);

  // Daily Study Goals state
  const [targetTopicsCount, setTargetTopicsCount] = useState(4);
  const [showAddTopicInput, setShowAddTopicInput] = useState(false);
  const [newTopicSubject, setNewTopicSubject] = useState('Fizika');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDuration, setNewTopicDuration] = useState(20);

  const [dailyTopics, setDailyTopics] = useState<DailyGoalTopic[]>([
    {
      id: 'goal-1',
      subject: 'Fizika',
      title: 'Kvant optikasi & E=hf formulasi',
      durationMin: 18,
      completed: true,
      icon: 'science',
      colorClass: 'bg-[#4244df] text-white',
      tag: 'Dars'
    },
    {
      id: 'goal-2',
      subject: 'Algebra',
      title: 'Kvadrat tengsizliklar va intervallar',
      durationMin: 25,
      completed: true,
      icon: 'calculate',
      colorClass: 'bg-[#4454bb] text-white',
      tag: 'Mashq'
    },
    {
      id: 'goal-3',
      subject: 'Biologiya',
      title: 'Hujayra mitozi: Profaza & Metafaza',
      durationMin: 15,
      completed: !hasActiveCatchup,
      icon: 'psychology',
      colorClass: 'bg-[#886b88] text-white',
      tag: 'Tiklash'
    },
    {
      id: 'goal-4',
      subject: 'Informatika',
      title: 'Python: OOP metodlari va merosxo\'rlik',
      durationMin: 20,
      completed: false,
      icon: 'terminal',
      colorClass: 'bg-[#1a1a2b] text-white',
      tag: 'Loyixa'
    }
  ]);

  const completedCount = dailyTopics.filter((t) => t.completed).length;
  const progressPercent = Math.min(100, Math.round((completedCount / targetTopicsCount) * 100));

  const handleToggleTopic = (topicId: string) => {
    playClickSound();
    setDailyTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id === topicId) {
          const nextState = !t.completed;
          if (nextState) {
            playSuccessChime();
          }
          return { ...t, completed: nextState };
        }
        return t;
      });

      const newCompleted = updated.filter((t) => t.completed).length;
      if (newCompleted >= targetTopicsCount && completedCount < targetTopicsCount) {
        // Goal achieved celebration!
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onEarnXp) {
          onEarnXp(50, 'Kunlik o\'quv maqsadi to\'liq bajarildi!');
        }
      }
      return updated;
    });
  };

  const handleAddCustomTopic = () => {
    if (!newTopicTitle.trim()) return;
    playSuccessChime();
    const newTopic: DailyGoalTopic = {
      id: `goal-${Date.now()}`,
      subject: newTopicSubject,
      title: newTopicTitle.trim(),
      durationMin: Number(newTopicDuration) || 20,
      completed: false,
      icon: newTopicSubject === 'Fizika' ? 'science' : newTopicSubject === 'Algebra' ? 'calculate' : newTopicSubject === 'Biologiya' ? 'psychology' : 'school',
      colorClass: 'bg-[#4244df] text-white',
      tag: 'Maxsus'
    };
    setDailyTopics((prev) => [...prev, newTopic]);
    setNewTopicTitle('');
    setShowAddTopicInput(false);
  };

  const handleChipClick = (topic: string) => {
    playClickSound();
    setQuery(topic);
    handleSendQuery(topic);
  };

  const handleSendQuery = (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;
    playClickSound();
    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsAiLoading(false);
      playSuccessChime();
      if (text.includes('hf') || text.toLowerCase().includes('formula')) {
        setAiResponse(
          language === 'uz'
            ? "E = hf formulasi — Plank-Eynshteyn munosabati. Foton energiyasi (E) bevosita nurning tebranish chastotasiga (f) bog'liq. h = 6.626 × 10⁻³⁴ J·s (Plank doimiysi). BSB-2 savollarida to'lqin uzunligi λ bilan bog'liq holda E = hc/λ ko'rinishida ham keladi!"
            : "Формула E = hf выражает квантованную энергию фотона через частоту f. Постоянная Планка h = 6.626 × 10⁻³⁴ Дж·с. В задачах БСБ-2 также используется форма E = hc/λ!"
        );
      } else if (text.toLowerCase().includes('mitoz') || text.toLowerCase().includes('hujayra') || text.toLowerCase().includes('митоз')) {
        setAiResponse(
          language === 'uz'
            ? "Hujayra mitozi 4 bosqichdan iborat: 1. Profaza (xromosomalar kondensatsiyasi), 2. Metafaza (ekvator bo'ylab saf tortish), 3. Anafaza (qutblarga ajralish), 4. Telofaza (yangi yadrolar hosil bo'lishi). Qoldirilgan darsingizni 6 daqiqalik modulda to'liq tiklashingiz mumkin!"
            : "Митоз включает 4 фазы: профаза, метафаза, анафаза и телофаза. Вы можете восстановить пропущенный урок в 6-минутном модуле!"
        );
      } else {
        setAiResponse(
          language === 'uz'
            ? `"${text}" mavzusi bo'yicha 10-A sinf o'quv dasturiga mos qisqa konspekt va BSB-2 test namunalari tayyorlandi.`
            : `По теме "${text}" подготовлен конспект и тестовые задания БСБ-2.`
        );
      }
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Language Switcher Bar */}
      <div className="bg-[#f5f2ff] p-3 rounded-2xl flex flex-col gap-2 shadow-[0_2px_8px_-2px_rgba(99,103,255,0.06)] border border-[#e8e6fe]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#454555] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#4244df]">translate</span>
            <span>Tilni tanlash / Выбор языка</span>
          </span>
          <span className="text-[11px] text-[#4244df] font-bold bg-[#e1e0ff] px-2 py-0.5 rounded-full">
            1-klikda tezkor
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#efecff] rounded-xl">
          <button
            onClick={() => onLanguageChange('uz')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
              language === 'uz'
                ? 'bg-white text-[#4244df] shadow-sm'
                : 'text-[#454555] hover:text-[#1a1a2b]'
            }`}
          >
            <span>🇺🇿</span>
            <span>O'zbekcha</span>
            {language === 'uz' && <span className="w-1.5 h-1.5 rounded-full bg-[#4244df] ml-0.5" />}
          </button>
          <button
            onClick={() => onLanguageChange('ru')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
              language === 'ru'
                ? 'bg-white text-[#4244df] shadow-sm'
                : 'text-[#454555] hover:text-[#1a1a2b]'
            }`}
          >
            <span>🇷🇺</span>
            <span>Русский</span>
            {language === 'ru' && <span className="w-1.5 h-1.5 rounded-full bg-[#4244df] ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Student Welcome Status Bento Card */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-5 shadow-[0_8px_24px_-4px_rgba(66,68,223,0.08)] border border-[#e8e6fe]">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#e1e0ff]/60 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#efecff] text-[#4244df] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#8393fe]" />
              {user.grade} • {user.schoolYear}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2b] tracking-tight font-display">
              {language === 'uz' ? `Salom, ${user.name}! 👋` : `Привет, ${user.name}! 👋`}
            </h2>
            <p className="text-xs text-[#454555]">
              {language === 'uz'
                ? 'Bugun 5 ta dars va 1 ta oraliq nazorat (BSB) rejalashtirilgan.'
                : 'Сегодня 5 уроков и 1 промежуточный контроль (БСБ).'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e1e0ff] flex items-center justify-center text-[#4244df] shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-2 bg-[#f5f2ff] p-3 rounded-2xl border border-[#e8e6fe]/70">
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] text-[#767587]">
              {language === 'uz' ? 'O\'rtacha baho' : 'Средний балл'}
            </span>
            <span className="text-lg font-bold text-[#4244df] mt-0.5 tabular-nums">
              {user.gpa}
            </span>
            <span className="text-[10px] text-[#767587]">maks. 5.0</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-[#c6c4d8]/40">
            <span className="text-[11px] text-[#767587]">
              {language === 'uz' ? 'Davomat' : 'Посещаемость'}
            </span>
            <span className="text-lg font-bold text-[#1a1a2b] mt-0.5 tabular-nums">
              {user.attendanceRate}%
            </span>
            <span className="text-[10px] text-[#4454bb] font-semibold">
              {language === 'uz' ? "A'lo daraja" : 'Отлично'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] text-[#767587]">
              {language === 'uz' ? 'Sinf o\'rni' : 'Рейтинг'}
            </span>
            <span className="text-lg font-bold text-[#6e536f] mt-0.5 tabular-nums">
              #{user.rankInCohort}
            </span>
            <span className="text-[10px] text-[#767587]">
              {user.cohortTotal} {language === 'uz' ? 'o\'quvchi' : 'учеников'}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Study Goals Tracker Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e1e0ff]/50 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#e1e0ff] text-[#4244df] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
                  {language === 'uz' ? 'Kunlik O\'quv Maqsadlari' : language === 'ru' ? 'Ежедневные учебные цели' : 'Daily Study Goals'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  completedCount >= targetTopicsCount ? 'bg-[#e1e0ff] text-[#4244df]' : 'bg-[#fbd8f9] text-[#29132c]'
                }`}>
                  {completedCount} / {targetTopicsCount} {language === 'uz' ? 'Mavzu' : 'Тем'}
                </span>
              </div>
              <p className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'Bugun rejalashtirilgan mavzular va darslar rivoji' : 'Прогресс по запланированным урокам на сегодня'}
              </p>
            </div>
          </div>

          {/* Target Topics Stepper */}
          <div className="flex items-center gap-1 bg-[#f5f2ff] p-1 rounded-2xl border border-[#e8e6fe]">
            <button
              onClick={() => {
                playClickSound();
                setTargetTopicsCount((c) => Math.max(2, c - 1));
              }}
              className="w-6 h-6 rounded-xl bg-white hover:bg-[#efecff] text-[#1a1a2b] font-bold text-xs flex items-center justify-center transition-colors shadow-xs"
              title="Maqsadni kamaytirish"
            >
              -
            </button>
            <span className="text-xs font-extrabold text-[#4244df] px-1 tabular-nums">
              {targetTopicsCount}
            </span>
            <button
              onClick={() => {
                playClickSound();
                setTargetTopicsCount((c) => Math.min(8, c + 1));
              }}
              className="w-6 h-6 rounded-xl bg-white hover:bg-[#efecff] text-[#1a1a2b] font-bold text-xs flex items-center justify-center transition-colors shadow-xs"
              title="Maqsadni oshirish"
            >
              +
            </button>
          </div>
        </div>

        {/* Progress Overview Banner */}
        <div className="p-4 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Radial SVG Progress Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#e3e0f8]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#4244df] transition-all duration-700 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[#1a1a2b] tabular-nums">
                {progressPercent}%
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1a1a2b]">
                  {completedCount >= targetTopicsCount
                    ? language === 'uz' ? 'Bugungi marra zabt etildi! 🎉' : 'Дневная цель достигнута! 🎉'
                    : language === 'uz' ? 'Kunlik maqsad sari odimlang' : 'Двигайтесь к дневной цели'}
                </span>
              </div>
              <p className="text-[11px] text-[#767587]">
                {dailyTopics.filter((t) => t.completed).reduce((a, b) => a + b.durationMin, 0)} daqiqa o'qildi • {completedCount} / {targetTopicsCount} yakunlandi
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              completedCount >= targetTopicsCount
                ? 'bg-[#e1e0ff] text-[#4244df]'
                : 'bg-[#fbd8f9] text-[#29132c]'
            }`}>
              {completedCount >= targetTopicsCount ? '+50 XP Bonusi Olindi ✓' : '+50 XP Maqsad Bonusi'}
            </span>
          </div>
        </div>

        {/* Interactive Topics Checklist */}
        <div className="space-y-2">
          {dailyTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleToggleTopic(topic.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                topic.completed
                  ? 'bg-[#f5f2ff]/60 border-[#e8e6fe] opacity-90'
                  : 'bg-white hover:bg-[#f5f2ff] border-[#e8e6fe] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Checkbox trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleTopic(topic.id);
                  }}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    topic.completed
                      ? 'bg-[#4244df] text-white shadow-xs'
                      : 'border-2 border-[#c6c4d8] bg-white hover:border-[#4244df]'
                  }`}
                >
                  {topic.completed && (
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  )}
                </button>

                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-xl ${topic.colorClass} flex items-center justify-center shrink-0 shadow-xs`}>
                    <span className="material-symbols-outlined text-[15px]">{topic.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#4244df] uppercase">{topic.subject}</span>
                      <span className="text-[9px] bg-[#efecff] text-[#454555] px-1.5 py-0.2 rounded font-semibold">{topic.tag}</span>
                    </div>
                    <p className={`text-xs font-bold truncate leading-tight ${
                      topic.completed ? 'line-through text-[#767587]' : 'text-[#1a1a2b]'
                    }`}>
                      {topic.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-[#767587] font-mono bg-[#efecff] px-2 py-0.5 rounded-lg">
                  {topic.durationMin}m
                </span>
                <span className={`text-[10px] font-bold ${topic.completed ? 'text-[#4244df]' : 'text-[#767587]'}`}>
                  {topic.completed ? 'Tayyor' : 'Kutilmoqda'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Study Topic Form / Toggle */}
        {!showAddTopicInput ? (
          <button
            onClick={() => {
              playClickSound();
              setShowAddTopicInput(true);
            }}
            className="w-full py-2 px-3 rounded-2xl bg-[#efecff] hover:bg-[#e8e6fe] text-[#4244df] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e8e6fe]"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>{language === 'uz' ? 'Bugunga yangi o\'quv maqsadi qo\'shish' : 'Добавить учебную цель на сегодня'}</span>
          </button>
        ) : (
          <div className="p-3 bg-[#f5f2ff] rounded-2xl border border-[#e8e6fe] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1a1a2b]">Yangi O'quv Maqsadi</span>
              <button
                onClick={() => setShowAddTopicInput(false)}
                className="text-[#767587] hover:text-[#1a1a2b]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <select
                value={newTopicSubject}
                onChange={(e) => setNewTopicSubject(e.target.value)}
                className="bg-white p-2 rounded-xl border border-[#e8e6fe] text-xs outline-none font-semibold text-[#1a1a2b]"
              >
                <option value="Fizika">Fizika</option>
                <option value="Algebra">Algebra</option>
                <option value="Biologiya">Biologiya</option>
                <option value="Kimyo">Kimyo</option>
                <option value="Ingliz tili">Ingliz tili</option>
                <option value="Informatika">Informatika</option>
              </select>

              <input
                type="text"
                placeholder="Mavzu nomi..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomTopic();
                }}
                className="sm:col-span-2 bg-white p-2 rounded-xl border border-[#e8e6fe] text-xs outline-none font-medium text-[#1a1a2b]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px] text-[#767587]">
                <span>Davomiyligi:</span>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newTopicDuration}
                  onChange={(e) => setNewTopicDuration(Number(e.target.value))}
                  className="w-14 bg-white p-1 rounded-lg border border-[#e8e6fe] text-center font-bold text-[#1a1a2b]"
                />
                <span>daqiqalar</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddTopicInput(false)}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#454555] text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAddCustomTopic}
                  disabled={!newTopicTitle.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4244df] hover:bg-[#5d61f9] text-white text-xs font-bold disabled:opacity-50 transition-all shadow-xs"
                >
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Subject Mastery Badges System */}
      <SubjectMasteryBadges
        language={language}
        onNavigateTab={onNavigateTab}
        hasActiveCatchup={hasActiveCatchup}
      />

      {/* Priority Catch-Up Alert Card */}
      {hasActiveCatchup && (
        <div className="relative overflow-hidden bg-[#fbd8f9] rounded-3xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(251,216,249,0.8)] border border-white text-[#29132c]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#6e536f] flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">warning_amber</span>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#583e59] font-display">
                  {language === 'uz' ? 'Qoldirilgan darsni tiklash' : 'Ликвидация пропуска'}
                </span>
                <span className="bg-white/90 text-[#4244df] text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  +45 XP
                </span>
              </div>
              <p className="text-sm font-bold text-[#1a1a2b] font-display leading-tight">
                {language === 'uz' ? 'Biologiya: Hujayra mitozi' : 'Биология: Митоз клетки'}
              </p>
              <p className="text-xs text-[#583e59]">
                {language === 'uz'
                  ? '6 daqiqalik ekspress konspekt va qisqa testni topshirib, 0 ballni yopishingiz mumkin.'
                  : 'Пройдите 6-минутный конспект и тест, чтобы закрыть 0 баллов.'}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={onOpenRecovery}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#4244df] hover:bg-[#5d61f9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(66,68,223,0.35)] active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>{language === 'uz' ? 'Darsni tiklash' : 'Восстановить'}</span>
                </button>
                <button
                  onClick={() => onAskAiTopic('Hujayra mitozi bosqichlari')}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-[#f5f2ff] text-[#4244df] font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span>{language === 'uz' ? 'AI dan so\'rash' : 'Спросить ИИ'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule & Instant Diary Snapshot */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Bugungi Kundalik' : 'Сегодняшний Дневник'}
            </h3>
            <p className="text-xs text-[#767587]">
              {language === 'uz' ? 'Payshanba, 17-Oktyabr' : 'Четверг, 17 Октября'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f5f2ff] px-2.5 py-1 rounded-full border border-[#e8e6fe]">
            <span className="w-2 h-2 rounded-full bg-[#4244df] animate-pulse" />
            <span className="text-[11px] text-[#4244df] font-bold">
              {language === 'uz' ? 'Dars jarayonida' : 'Идет учебный день'}
            </span>
          </div>
        </div>

        {/* Timeline item 1: Fizika */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8e6fe] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#e1e0ff] text-[#4244df] text-[11px] font-bold">
                08:30 - 09:15
              </span>
              <span className="text-xs text-[#767587]">Xona 304</span>
            </div>
            <div className="flex items-center gap-1 bg-[#dfe0ff] px-2.5 py-0.5 rounded-full text-[#000e5f] font-bold text-xs">
              <span>⭐</span>
              <span>5 (A'lo)</span>
            </div>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#1a1a2b]">Fizika: Kvant optikasi</h4>
              <p className="text-xs text-[#454555]">BSB-2 ga tayyorgarlik va amaliy tajriba</p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-[#f5f2ff] text-[#4454bb] text-xs font-bold shrink-0">
              100 ball
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#f5f2ff] text-xs">
            <span className="text-[#454555] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#4244df]">check_circle</span>
              {language === 'uz' ? 'Vazifa topshirildi' : 'Задание сдано'}
            </span>
            <button
              onClick={() => onNavigateTab('lesson')}
              className="text-[#4244df] font-bold flex items-center gap-0.5 hover:underline"
            >
              {language === 'uz' ? 'Darsni ochish' : 'Открыть урок'}
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Timeline item 2: Algebra */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8e6fe] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#efecff] text-[#454555] text-[11px] font-semibold">
                09:25 - 10:10
              </span>
              <span className="text-xs text-[#767587]">Xona 210</span>
            </div>
            <div className="flex items-center gap-1 bg-[#dfe0ff] px-2.5 py-0.5 rounded-full text-[#000e5f] font-bold text-xs">
              <span>⭐</span>
              <span>5 (A'lo)</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1a1a2b]">Algebra: Kvadrat tengsizliklar</h4>
            <p className="text-xs text-[#454555]">Intervallar usuli va grafik yechimlar</p>
          </div>
          <div className="w-full bg-[#efecff] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4244df] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Timeline item 3: Biologiya (Qoldirilgan) */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e8e6fe] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#efecff] text-[#767587] text-[11px]">
                10:20 - 11:05
              </span>
              <span className="text-xs text-[#767587]">Laboratoriya 1</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
              {language === 'uz' ? 'Dars qoldirilgan' : 'Пропущен'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1a1a2b]">Biologiya: Hujayra mitozi</h4>
            <p className="text-xs text-[#454555]">Bugun soat 20:00 gacha qayta topshirish ochiq</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#f5f2ff]">
            <span className="text-xs text-[#767587]">Tiklash rejimi faol</span>
            <button
              onClick={onOpenRecovery}
              className="text-xs text-[#4244df] font-bold bg-[#e1e0ff] hover:bg-[#c0c1ff] px-3 py-1 rounded-full transition-colors"
            >
              Hozir boshlash
            </button>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('schedule')}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#efecff] hover:bg-[#e8e6fe] text-[#4244df] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
          <span>{language === 'uz' ? 'Barcha darslar jadvali va elektron kundalik' : 'Полное расписание и дневник'}</span>
        </button>
      </div>

      {/* Choraklik va BSB Tayyorgarlik Monitoringi */}
      <div className="bg-white p-5 rounded-3xl shadow-[0_6px_20px_rgba(66,68,223,0.06)] border border-[#e8e6fe] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#4244df] uppercase tracking-wider block font-display">
              {language === 'uz' ? 'I-Chorak monitoringi' : 'Мониторинг I-четверти'}
            </span>
            <h3 className="text-base font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Choraklik va BSB Tayyorgarlik' : 'Четвертные и подготовка к БСБ'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-[#4244df] tabular-nums block leading-none">
              {user.gpa}
            </span>
            <span className="text-[10px] text-[#767587]">Joriy reyting</span>
          </div>
        </div>

        {/* Quarter Countdown */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-[#4244df] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1a2b]">Chorak yakunlanishiga 14 kun qoldi</p>
              <p className="text-[11px] text-[#454555]">Oraliq nazorat (BSB) haftaligi boshlanmoqda</p>
            </div>
          </div>
          <span className="text-xs text-[#4454bb] font-extrabold">1-Noyabr</span>
        </div>

        {/* Upcoming BSB cards */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#454555]">Yaqinlashayotgan BSB/CHSB sanalari:</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4244df]" />
                  <h5 className="text-xs font-bold text-[#1a1a2b]">Fizika BSB-2</h5>
                  <span className="text-xs text-[#767587]">• 22-Okt</span>
                </div>
                <p className="text-[11px] text-[#454555]">Optika, foton energiyasi va spektrlar</p>
              </div>
              <button
                onClick={() => onAskAiTopic('Fizika BSB-2 ga tayyorgarlik')}
                className="px-2.5 py-1.5 rounded-xl bg-[#4244df] hover:bg-[#5d61f9] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>AI Tayyorlov</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6e536f]" />
                  <h5 className="text-xs font-bold text-[#1a1a2b]">Biologiya BSB-2</h5>
                  <span className="text-xs text-[#767587]">• 25-Okt</span>
                </div>
                <p className="text-[11px] text-[#454555]">Molekulyar genetika asoslari</p>
              </div>
              <span className="text-xs text-[#767587] font-semibold bg-white px-2.5 py-1 rounded-lg">
                Rejada
              </span>
            </div>
          </div>
        </div>

        {/* Subject Mini-Grade Cards */}
        <div className="pt-1 space-y-1.5">
          <span className="text-xs font-bold text-[#454555]">Fanlar bo'yicha joriy baholar:</span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#f5f2ff] p-2 rounded-2xl border border-[#e8e6fe]">
              <span className="text-[10px] text-[#767587] block">Fizika</span>
              <span className="text-sm font-bold text-[#1a1a2b]">5.0</span>
            </div>
            <div className="bg-[#f5f2ff] p-2 rounded-2xl border border-[#e8e6fe]">
              <span className="text-[10px] text-[#767587] block">Algebra</span>
              <span className="text-sm font-bold text-[#1a1a2b]">5.0</span>
            </div>
            <div className="bg-[#f5f2ff] p-2 rounded-2xl border border-[#e8e6fe]">
              <span className="text-[10px] text-[#767587] block">Kimyo</span>
              <span className="text-sm font-bold text-[#1a1a2b]">4.8</span>
            </div>
            <div className="bg-[#ffdad6] p-2 rounded-2xl border border-[#ba1a1a]/20">
              <span className="text-[10px] text-[#ba1a1a] font-bold block">Biologiya</span>
              <span className="text-sm font-bold text-[#ba1a1a]">3.6 ⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Ustoz Interactive Widget Box */}
      <div className="relative bg-white p-5 rounded-3xl shadow-[0_8px_24px_rgba(66,68,223,0.08)] border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#4244df] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1a1a2b] flex items-center gap-1.5 font-display">
                <span>Ilmhub AI Ustoz</span>
                <span className="w-2 h-2 rounded-full bg-[#8393fe] animate-ping" />
              </h4>
              <p className="text-[11px] text-[#767587]">24/7 Shaxsiy repetitor</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#e1e0ff] text-[#4244df] px-2.5 py-0.5 rounded-full font-bold">
            GPT-4o EdTech
          </span>
        </div>

        <div className="bg-[#f5f2ff] p-3.5 rounded-2xl space-y-2 border border-[#e8e6fe]">
          <p className="text-xs text-[#1a1a2b] leading-relaxed">
            {language === 'uz'
              ? '“Assalomu alaykum Jasur! Bugungi fizika darsidagi E = hf formulasini yoki BSB-2 ga oid testlarni birga tahlil qilamizmi?”'
              : '«Здравствуйте, Жасур! Разберем формулу E = hf по сегодняшней физике или вопросы к БСБ-2?»'}
          </p>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => handleChipClick('Formula: E = hf')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#4244df] hover:text-white text-[#1a1a2b] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs border border-[#e8e6fe]"
            >
              <span className="material-symbols-outlined text-[13px]">functions</span>
              <span>Formula: E = hf</span>
            </button>
            <button
              onClick={() => handleChipClick('BSB-2 test savollari')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#4244df] hover:text-white text-[#1a1a2b] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs border border-[#e8e6fe]"
            >
              <span className="material-symbols-outlined text-[13px]">quiz</span>
              <span>BSB-2 test savollari</span>
            </button>
            <button
              onClick={() => handleChipClick('Hujayra mitozi bosqichlari')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#4244df] hover:text-white text-[#1a1a2b] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs border border-[#e8e6fe]"
            >
              <span className="material-symbols-outlined text-[13px]">biotech</span>
              <span>Hujayra mitozi</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendQuery();
              }}
              placeholder={language === 'uz' ? 'Dars yoki vazifadan savol bering...' : 'Задайте вопрос по уроку...'}
              className="w-full bg-[#f5f2ff] text-[#1a1a2b] placeholder:text-[#767587] text-xs py-2.5 pl-3.5 pr-9 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#4244df]/30 transition-all border border-[#e8e6fe]"
            />
            <button
              onClick={() => alert('Kamera yoki formula rasmini yuklash rejimi faollashdi')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767587] hover:text-[#4244df]"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          </div>

          <button
            onClick={() => setMicActive(!micActive)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              micActive ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#efecff] text-[#454555] hover:bg-[#e8e6fe]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>

          <button
            onClick={() => handleSendQuery()}
            disabled={isAiLoading || !query.trim()}
            className="w-9 h-9 rounded-xl bg-[#4244df] hover:bg-[#5d61f9] text-white flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAiLoading ? 'sync' : 'arrow_upward'}
            </span>
          </button>
        </div>

        {/* Live response box */}
        {aiResponse && (
          <div className="p-3.5 bg-[#efecff] rounded-2xl text-xs text-[#1a1a2b] space-y-1 animate-in fade-in duration-200 border border-[#4244df]/20">
            <div className="flex items-center gap-1.5 text-[#4244df] font-bold">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>AI Ustoz tahlili:</span>
            </div>
            <p className="text-[#454555] leading-relaxed">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
