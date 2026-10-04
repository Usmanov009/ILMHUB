import React, { useState } from 'react';
import { Language } from '../types';
import { playClickSound, playSuccessChime } from '../utils/sound';

interface WeeklyStudyPlannerProps {
  language: Language;
  onPlanUpdated?: (totalHours: number) => void;
}

interface PlannedSession {
  dayId: string;
  slotId: string;
  subjectId: string;
  subjectName: string;
  icon: string;
  colorClass: string;
  durationMin: number;
}

interface AvailableSubject {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  badgeBg: string;
}

const AVAILABLE_SUBJECTS: AvailableSubject[] = [
  {
    id: 'phys',
    nameUz: 'Fizika (BSB-2)',
    nameRu: 'Физика (БСБ-2)',
    nameEn: 'Physics (BSB-2)',
    icon: 'science',
    colorClass: 'bg-[#4244df] text-white',
    borderClass: 'border-[#4244df]',
    badgeBg: 'bg-[#e1e0ff] text-[#05006c]'
  },
  {
    id: 'math',
    nameUz: 'Algebra & Geometriya',
    nameRu: 'Алгебра & Геометрия',
    nameEn: 'Algebra & Geometry',
    icon: 'calculate',
    colorClass: 'bg-[#4454bb] text-white',
    borderClass: 'border-[#4454bb]',
    badgeBg: 'bg-[#dfe0ff] text-[#000e5f]'
  },
  {
    id: 'bio',
    nameUz: 'Biologiya (Tiklash)',
    nameRu: 'Биология (Пропуск)',
    nameEn: 'Biology (Catch-up)',
    icon: 'psychology',
    colorClass: 'bg-[#886b88] text-white',
    borderClass: 'border-[#886b88]',
    badgeBg: 'bg-[#fbd8f9] text-[#29132c]'
  },
  {
    id: 'chem',
    nameUz: 'Kimyo Laboratoriya',
    nameRu: 'Химия Лаборатория',
    nameEn: 'Chemistry Lab',
    icon: 'biotech',
    colorClass: 'bg-[#5d61f9] text-white',
    borderClass: 'border-[#5d61f9]',
    badgeBg: 'bg-[#efecff] text-[#4244df]'
  },
  {
    id: 'eng',
    nameUz: 'Ingliz tili (IELTS)',
    nameRu: 'Английский (IELTS)',
    nameEn: 'English (IELTS)',
    icon: 'language',
    colorClass: 'bg-[#2928ca] text-white',
    borderClass: 'border-[#2928ca]',
    badgeBg: 'bg-[#e8e6fe] text-[#2928ca]'
  },
  {
    id: 'cs',
    nameUz: 'Python Dasturlash',
    nameRu: 'Python Программирование',
    nameEn: 'Python Programming',
    icon: 'terminal',
    colorClass: 'bg-[#1a1a2b] text-white',
    borderClass: 'border-[#1a1a2b]',
    badgeBg: 'bg-[#efecff] text-[#1a1a2b]'
  }
];

const WEEK_DAYS = [
  { id: 'mon', nameUz: 'Dush', nameRu: 'Пон', nameEn: 'Mon' },
  { id: 'tue', nameUz: 'Sesh', nameRu: 'Втор', nameEn: 'Tue' },
  { id: 'wed', nameUz: 'Chor', nameRu: 'Сре', nameEn: 'Wed' },
  { id: 'thu', nameUz: 'Pay', nameRu: 'Чет', nameEn: 'Thu' },
  { id: 'fri', nameUz: 'Juma', nameRu: 'Пят', nameEn: 'Fri' },
  { id: 'sat', nameUz: 'Shan', nameRu: 'Суб', nameEn: 'Sat' },
  { id: 'sun', nameUz: 'Yak', nameRu: 'Вск', nameEn: 'Sun' }
];

const TIME_SLOTS = [
  { id: 'slot-morning', time: '07:00 - 08:00', labelUz: 'Ertalabki takrorlash', labelRu: 'Утреннее повторение', labelEn: 'Morning Review' },
  { id: 'slot-afternoon', time: '16:00 - 17:30', labelUz: 'Darsdan so\'ng (Vazifa)', labelRu: 'После уроков (ДЗ)', labelEn: 'After School (Homework)' },
  { id: 'slot-evening', time: '19:30 - 21:00', labelUz: 'Kechki BSB tayyorlov', labelRu: 'Вечерняя подготовка к БСБ', labelEn: 'Evening BSB Focus' }
];

const INITIAL_SESSIONS: PlannedSession[] = [
  {
    dayId: 'mon',
    slotId: 'slot-afternoon',
    subjectId: 'math',
    subjectName: 'Algebra & Geometriya',
    icon: 'calculate',
    colorClass: 'bg-[#4454bb] text-white',
    durationMin: 90
  },
  {
    dayId: 'tue',
    slotId: 'slot-evening',
    subjectId: 'phys',
    subjectName: 'Fizika (BSB-2)',
    icon: 'science',
    colorClass: 'bg-[#4244df] text-white',
    durationMin: 90
  },
  {
    dayId: 'thu',
    slotId: 'slot-morning',
    subjectId: 'bio',
    subjectName: 'Biologiya (Tiklash)',
    icon: 'psychology',
    colorClass: 'bg-[#886b88] text-white',
    durationMin: 60
  },
  {
    dayId: 'fri',
    slotId: 'slot-afternoon',
    subjectId: 'eng',
    subjectName: 'Ingliz tili (IELTS)',
    icon: 'language',
    colorClass: 'bg-[#2928ca] text-white',
    durationMin: 90
  }
];

export const WeeklyStudyPlanner: React.FC<WeeklyStudyPlannerProps> = ({
  language,
  onPlanUpdated
}) => {
  const [sessions, setSessions] = useState<PlannedSession[]>(INITIAL_SESSIONS);
  const [draggedSubject, setDraggedSubject] = useState<AvailableSubject | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<AvailableSubject | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  const getSubjectName = (sub: AvailableSubject) => {
    if (language === 'uz') return sub.nameUz;
    if (language === 'ru') return sub.nameRu;
    return sub.nameEn;
  };

  const getSlotLabel = (slot: typeof TIME_SLOTS[0]) => {
    if (language === 'uz') return slot.labelUz;
    if (language === 'ru') return slot.labelRu;
    return slot.labelEn;
  };

  const handleDragStart = (sub: AvailableSubject) => {
    setDraggedSubject(sub);
    setSelectedSubject(sub);
  };

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    setDragOverCell(cellId);
  };

  const handleDrop = (dayId: string, slotId: string) => {
    setDragOverCell(null);
    const subToPlace = draggedSubject || selectedSubject;
    if (!subToPlace) return;

    assignSubjectToSlot(dayId, slotId, subToPlace);
    setDraggedSubject(null);
  };

  const handleCellClick = (dayId: string, slotId: string) => {
    if (selectedSubject) {
      assignSubjectToSlot(dayId, slotId, selectedSubject);
    }
  };

  const assignSubjectToSlot = (dayId: string, slotId: string, sub: AvailableSubject) => {
    playSuccessChime();
    const duration = slotId === 'slot-morning' ? 60 : 90;
    const newSession: PlannedSession = {
      dayId,
      slotId,
      subjectId: sub.id,
      subjectName: getSubjectName(sub),
      icon: sub.icon,
      colorClass: sub.colorClass,
      durationMin: duration
    };

    setSessions((prev) => {
      // Replace existing in that slot or add new
      const filtered = prev.filter((s) => !(s.dayId === dayId && s.slotId === slotId));
      const updated = [...filtered, newSession];
      const totalMinutes = updated.reduce((acc, cur) => acc + cur.durationMin, 0);
      if (onPlanUpdated) onPlanUpdated(Number((totalMinutes / 60).toFixed(1)));
      return updated;
    });
  };

  const handleRemoveSession = (dayId: string, slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setSessions((prev) => {
      const updated = prev.filter((s) => !(s.dayId === dayId && s.slotId === slotId));
      const totalMinutes = updated.reduce((acc, cur) => acc + cur.durationMin, 0);
      if (onPlanUpdated) onPlanUpdated(Number((totalMinutes / 60).toFixed(1)));
      return updated;
    });
  };

  const handleAutoOptimize = () => {
    playSuccessChime();
    // Smart auto-distribution of study sessions: BSB prep in evenings, science in afternoon
    const optimized: PlannedSession[] = [
      { dayId: 'mon', slotId: 'slot-afternoon', subjectId: 'math', subjectName: 'Algebra & Geometriya', icon: 'calculate', colorClass: 'bg-[#4454bb] text-white', durationMin: 90 },
      { dayId: 'tue', slotId: 'slot-evening', subjectId: 'phys', subjectName: 'Fizika (BSB-2)', icon: 'science', colorClass: 'bg-[#4244df] text-white', durationMin: 90 },
      { dayId: 'wed', slotId: 'slot-afternoon', subjectId: 'chem', subjectName: 'Kimyo Laboratoriya', icon: 'biotech', colorClass: 'bg-[#5d61f9] text-white', durationMin: 90 },
      { dayId: 'thu', slotId: 'slot-morning', subjectId: 'bio', subjectName: 'Biologiya (Tiklash)', icon: 'psychology', colorClass: 'bg-[#886b88] text-white', durationMin: 60 },
      { dayId: 'fri', slotId: 'slot-afternoon', subjectId: 'eng', subjectName: 'Ingliz tili (IELTS)', icon: 'language', colorClass: 'bg-[#2928ca] text-white', durationMin: 90 },
      { dayId: 'sat', slotId: 'slot-morning', subjectId: 'cs', subjectName: 'Python Dasturlash', icon: 'terminal', colorClass: 'bg-[#1a1a2b] text-white', durationMin: 60 }
    ];
    setSessions(optimized);
    const totalMinutes = optimized.reduce((acc, cur) => acc + cur.durationMin, 0);
    if (onPlanUpdated) onPlanUpdated(Number((totalMinutes / 60).toFixed(1)));
  };

  const handleClearAll = () => {
    playClickSound();
    setSessions([]);
    if (onPlanUpdated) onPlanUpdated(0);
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMin, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <section className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8e6fe] space-y-4">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#e1e0ff] flex items-center justify-center text-[#4244df] shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">calendar_view_week</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Haftalik Mustaqil Ta\'lim Planeri' : language === 'ru' ? 'Еженедельный план подготовки' : 'Weekly Study Planner'}
              </h2>
              <span className="bg-[#fbd8f9] text-[#29132c] text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
                Drag &amp; Drop
              </span>
            </div>
            <p className="text-xs text-[#767587]">
              {language === 'uz'
                ? 'Fanlarni kerakli vaqt oralig\'iga suring yoki tanlab bosing'
                : 'Перетащите предметы или выберите и нажмите на ячейку'}
            </p>
          </div>
        </div>

        {/* Stats Pill & Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-[#f5f2ff] px-3 py-1.5 rounded-2xl border border-[#e8e6fe] flex items-center gap-1.5 text-xs font-bold text-[#4244df]">
            <span className="material-symbols-outlined text-[16px]">timelapse</span>
            <span>{sessions.length} ta dars • {totalHours} soat / hafta</span>
          </div>
          <button
            onClick={handleAutoOptimize}
            className="px-3 py-1.5 rounded-xl bg-[#efecff] hover:bg-[#e1e0ff] text-[#4244df] text-xs font-bold flex items-center gap-1 transition-colors"
            title="AI orqali darslarni optimal taqsimlash"
          >
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            <span className="hidden sm:inline">AI Auto</span>
          </button>
          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-xl bg-[#f5f2ff] hover:bg-[#ffdad6] text-[#767587] hover:text-[#ba1a1a] transition-colors"
            title="Hammasini tozalash"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
          </button>
        </div>
      </div>

      {/* Available Subject Drawer (Draggable Palette) */}
      <div className="bg-[#f5f2ff] p-3 rounded-2xl border border-[#e8e6fe] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#454555] uppercase tracking-wider text-[10px] font-display">
            {language === 'uz' ? 'Mavjud Fanlar (Suring yoki bosing):' : 'Предметы (Перетащите или нажмите):'}
          </span>
          {selectedSubject && (
            <span className="text-[11px] text-[#4244df] font-bold">
              Tanlandi: {getSubjectName(selectedSubject)} ✓
            </span>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {AVAILABLE_SUBJECTS.map((sub) => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <div
                key={sub.id}
                draggable
                onDragStart={() => handleDragStart(sub)}
                onClick={() => {
                  playClickSound();
                  setSelectedSubject(isSelected ? null : sub);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 cursor-grab active:cursor-grabbing transition-all select-none border ${
                  isSelected
                    ? `${sub.colorClass} shadow-md scale-105 ring-2 ring-[#4244df]`
                    : `${sub.badgeBg} ${sub.borderClass} hover:shadow-xs`
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                <span>{getSubjectName(sub)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekday & Time Slot Grid Container */}
      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-[#e8e6fe]">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-[#efecff] text-[#454555] text-xs font-bold border-b border-[#e8e6fe]">
              <th className="p-3 w-36 font-display">Vaqt / Kun</th>
              {WEEK_DAYS.map((day) => (
                <th key={day.id} className="p-3 text-center font-display">
                  {language === 'uz' ? day.nameUz : day.nameRu}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6fe] text-xs">
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.id} className="hover:bg-[#fcf8ff]">
                {/* Time Slot Label */}
                <td className="p-3 bg-[#f5f2ff] border-r border-[#e8e6fe] space-y-0.5">
                  <span className="font-extrabold text-[#1a1a2b] block">{slot.time}</span>
                  <span className="text-[10px] text-[#767587] block leading-tight">{getSlotLabel(slot)}</span>
                </td>

                {/* Day Cells */}
                {WEEK_DAYS.map((day) => {
                  const cellId = `${day.id}-${slot.id}`;
                  const session = sessions.find((s) => s.dayId === day.id && s.slotId === slot.id);
                  const isOver = dragOverCell === cellId;

                  return (
                    <td
                      key={day.id}
                      onDragOver={(e) => handleDragOver(e, cellId)}
                      onDragLeave={() => setDragOverCell(null)}
                      onDrop={() => handleDrop(day.id, slot.id)}
                      onClick={() => handleCellClick(day.id, slot.id)}
                      className={`p-2 text-center transition-all h-20 align-top cursor-pointer border-r border-[#e8e6fe] last:border-r-0 relative ${
                        isOver
                          ? 'bg-[#e1e0ff]/70 border-2 border-dashed border-[#4244df]'
                          : session
                          ? 'bg-[#ffffff]'
                          : 'bg-[#faf8ff] hover:bg-[#efecff]/40'
                      }`}
                    >
                      {session ? (
                        <div
                          className={`w-full h-full p-2 rounded-xl text-left flex flex-col justify-between shadow-xs transition-transform hover:scale-[1.02] relative group ${session.colorClass}`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="material-symbols-outlined text-[15px] opacity-90">
                              {session.icon}
                            </span>
                            <button
                              onClick={(e) => handleRemoveSession(day.id, slot.id, e)}
                              className="w-4 h-4 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center text-[10px] opacity-80 group-hover:opacity-100 transition-opacity"
                              title="O'chirish"
                            >
                              ✕
                            </button>
                          </div>
                          <div>
                            <span className="font-bold text-[11px] block leading-tight line-clamp-1">
                              {session.subjectName}
                            </span>
                            <span className="text-[9px] opacity-80 font-mono">
                              {session.durationMin} daqiqa
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#c6c4d8] hover:text-[#4244df] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                          <span className="text-[9px] font-semibold">
                            {selectedSubject ? 'Joylash' : 'Bo\'sh'}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planner Summary Footer */}
      <div className="p-3.5 bg-[#f5f2ff] rounded-2xl border border-[#e8e6fe] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#454555]">
          <span className="material-symbols-outlined text-[#4244df] text-[18px]">lightbulb</span>
          <span>
            {language === 'uz'
              ? 'Tavsiya: BSB-2 gacha bo\'lgan kunlarda Fizika va Matematika uchun kamida 3 ta kechki blok ajrating!'
              : 'Совет: выделите не менее 3 вечерних блоков для Физики и Математики перед БСБ-2!'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-bold text-[#4244df] shrink-0">
          <span>Haftalik davomiylik:</span>
          <span className="bg-white px-2.5 py-0.5 rounded-lg border border-[#e8e6fe] tabular-nums">
            {totalHours} soat
          </span>
        </div>
      </div>
    </section>
  );
};
