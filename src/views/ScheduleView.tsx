import React, { useState } from 'react';
import { WEEKLY_TIMETABLES, BELL_SCHEDULE } from '../data/mockData';
import { Language, TimetableLesson } from '../types';
import { playClickSound } from '../utils/sound';
import { WeeklyStudyPlanner } from '../components/WeeklyStudyPlanner';

interface ScheduleViewProps {
  language: Language;
  onOpenRecovery: () => void;
  onOpenHomeworkModal: (type: 'physics_test' | 'algebra_photo') => void;
  onAskTeacher: (teacherName: string) => void;
  hasActiveCatchup: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  language,
  onOpenRecovery,
  onOpenHomeworkModal,
  onAskTeacher,
  hasActiveCatchup
}) => {
  const [selectedDay, setSelectedDay] = useState(17); // 17 is Thursday (Bugun)
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'bell'>('daily');
  const [lessonFilter, setLessonFilter] = useState<'all' | 'graded' | 'homework'>('all');

  const days = [
    { num: 14, nameUz: 'Dush', nameRu: 'Пон', nameEn: 'Mon', fullNameUz: 'Dushanba', fullNameRu: 'Понедельник' },
    { num: 15, nameUz: 'Sesh', nameRu: 'Втор', nameEn: 'Tue', fullNameUz: 'Seshanba', fullNameRu: 'Вторник' },
    { num: 16, nameUz: 'Chor', nameRu: 'Сре', nameEn: 'Wed', fullNameUz: 'Chorshanba', fullNameRu: 'Среда' },
    { num: 17, nameUz: 'Pay', nameRu: 'Чет', nameEn: 'Thu', fullNameUz: 'Payshanba', fullNameRu: 'Четверг', isToday: true },
    { num: 18, nameUz: 'Juma', nameRu: 'Пят', nameEn: 'Fri', fullNameUz: 'Juma', fullNameRu: 'Пятница' },
    { num: 19, nameUz: 'Shan', nameRu: 'Суб', nameEn: 'Sat', fullNameUz: 'Shanba', fullNameRu: 'Суббота' }
  ];

  // Get selected day timetable
  const currentDayData = WEEKLY_TIMETABLES[selectedDay] || WEEKLY_TIMETABLES[17];
  const allLessons = currentDayData.lessons;

  // Filter lessons
  const displayedLessons = allLessons.filter((l) => {
    if (lessonFilter === 'graded') return !!l.grade;
    if (lessonFilter === 'homework') return !!l.homeworkTask;
    return true;
  });

  const getSubjectColor = (subject: string) => {
    if (subject.includes('Fizika')) return { bg: 'bg-[#4244df]', text: 'text-[#4244df]', light: 'bg-[#efecff]' };
    if (subject.includes('Algebra') || subject.includes('Geometriya')) return { bg: 'bg-[#4454bb]', text: 'text-[#4454bb]', light: 'bg-[#dfe0ff]' };
    if (subject.includes('Biologiya')) return { bg: 'bg-[#008272]', text: 'text-[#008272]', light: 'bg-[#e0f5f2]' };
    if (subject.includes('Kimyo')) return { bg: 'bg-[#9c4146]', text: 'text-[#9c4146]', light: 'bg-[#ffebee]' };
    if (subject.includes('Ingliz')) return { bg: 'bg-[#2928ca]', text: 'text-[#2928ca]', light: 'bg-[#e8e6fe]' };
    if (subject.includes('Ona tili') || subject.includes('Adabiyot')) return { bg: 'bg-[#9a3f70]', text: 'text-[#9a3f70]', light: 'bg-[#fcebf3]' };
    if (subject.includes('Informatika') || subject.includes('Algoritm')) return { bg: 'bg-[#1a1a2b]', text: 'text-[#1a1a2b]', light: 'bg-[#f0f0f5]' };
    if (subject.includes('Tarix') || subject.includes('Huquq')) return { bg: 'bg-[#8a5d00]', text: 'text-[#8a5d00]', light: 'bg-[#fff4d9]' };
    return { bg: 'bg-[#4244df]', text: 'text-[#4244df]', light: 'bg-[#efecff]' };
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Header & Student Info Card */}
      <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#4244df] uppercase tracking-wider font-display">
              {language === 'uz' ? 'Elektron Kundalik & Dars Jadvali' : 'Электронный дневник и расписание'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4244df]" />
            <span className="text-[11px] text-[#767587]">2024–2025</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1a2b] tracking-tight font-display mt-0.5">
            {language === 'uz' ? "Jasur Mahmudov — Dars Jadvali" : 'Жасур Махмудов — Расписание уроков'}
          </h1>
          <p className="text-xs text-[#767587] mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-[#1a1a2b]">
              <span className="material-symbols-outlined text-[15px] text-[#4244df]">school</span>
              10-A sinf
            </span>
            <span>•</span>
            <span>{language === 'uz' ? 'Haftalik darslar: 31 ta soat' : '31 час занятий в неделю'}</span>
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex bg-[#f5f2ff] p-1 rounded-2xl border border-[#e8e6fe] shrink-0 self-start sm:self-center">
          <button
            onClick={() => {
              playClickSound();
              setViewMode('daily');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'daily'
                ? 'bg-white text-[#4244df] shadow-xs'
                : 'text-[#767587] hover:text-[#1a1a2b]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>{language === 'uz' ? 'Kunlik' : 'По дням'}</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setViewMode('weekly');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'weekly'
                ? 'bg-white text-[#4244df] shadow-xs'
                : 'text-[#767587] hover:text-[#1a1a2b]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_week</span>
            <span>{language === 'uz' ? 'Haftalik jadval' : 'Вся неделя'}</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setViewMode('bell');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'bell'
                ? 'bg-white text-[#4244df] shadow-xs'
                : 'text-[#767587] hover:text-[#1a1a2b]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>{language === 'uz' ? 'Qo\'ng\'iroqlar' : 'Звонки'}</span>
          </button>
        </div>
      </section>

      {/* Bento Stat Strip */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e8e6fe] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-[#767587] font-medium">
              {language === 'uz' ? 'O\'rtacha baho' : 'Средний балл'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-[#4244df] tabular-nums">4.8</span>
              <span className="text-xs text-[#767587]">/ 5.0</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-2xl bg-[#fbd8f9] text-[#29132c] shadow-xs">
            <span className="material-symbols-outlined text-[20px] text-[#4244df]">stars</span>
            <span className="text-[8px] leading-none font-bold uppercase mt-0.5">A'lo</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e8e6fe] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-[#767587] font-medium">
              {language === 'uz' ? 'Davomat darajasi' : 'Посещаемость'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-[#1a1a2b] tabular-nums">
                {hasActiveCatchup ? '98%' : '100%'}
              </span>
            </div>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#efecff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#4244df]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${hasActiveCatchup ? 98 : 100}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="material-symbols-outlined absolute text-[16px] text-[#4244df]">verified</span>
          </div>
        </div>
      </section>

      {/* MODE 1: DAILY TIMETABLE VIEW */}
      {viewMode === 'daily' && (
        <>
          {/* Horizontal Weekly Calendar Strip */}
          <section className="bg-white p-4 rounded-3xl shadow-xs border border-[#e8e6fe]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4244df] text-[20px]">calendar_today</span>
                <span className="text-sm font-bold text-[#1a1a2b]">
                  {currentDayData.dateStrUz}
                </span>
              </div>
              {selectedDay === 17 && (
                <span className="text-[10px] bg-[#e1e0ff] text-[#05006c] px-2.5 py-0.5 rounded-full font-bold">
                  {language === 'uz' ? 'Bugun' : 'Сегодня'}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {days.map((d) => {
                const isSelected = selectedDay === d.num;
                const dayLessonsCount = WEEKLY_TIMETABLES[d.num]?.lessons.length || 5;
                return (
                  <button
                    key={d.num}
                    onClick={() => {
                      playClickSound();
                      setSelectedDay(d.num);
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition-all flex-1 min-w-[50px] ${
                      isSelected
                        ? 'bg-[#4244df] text-white shadow-md scale-[1.03]'
                        : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#454555]'
                    }`}
                  >
                    <span className={`text-[11px] ${isSelected ? 'text-[#e1e0ff]' : 'text-[#767587]'} font-semibold`}>
                      {language === 'uz' ? d.nameUz : d.nameRu}
                    </span>
                    <span className="text-sm font-extrabold mt-0.5 tabular-nums">
                      {d.num}
                    </span>
                    <span className={`text-[9px] mt-0.5 font-medium ${isSelected ? 'text-[#e1e0ff]' : 'text-[#767587]'}`}>
                      {dayLessonsCount} dars
                    </span>
                    {d.isToday && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-[#fbd8f9]' : 'bg-[#4244df]'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Timetable List Section */}
          <section className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
                  {currentDayData.dayNameUz} {language === 'uz' ? `dars jadvali (${allLessons.length} ta dars)` : `— Расписание уроков (${allLessons.length})`}
                </h2>
                <span className="text-xs text-[#767587]">
                  {allLessons[0]?.time.split(' - ')[0]} — {allLessons[allLessons.length - 1]?.time.split(' - ')[1]}
                </span>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLessonFilter('all')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                    lessonFilter === 'all'
                      ? 'bg-[#4244df] text-white shadow-xs'
                      : 'bg-[#efecff] text-[#454555] hover:text-[#1a1a2b]'
                  }`}
                >
                  {language === 'uz' ? 'Barchasi' : 'Все'} ({allLessons.length})
                </button>
                <button
                  onClick={() => setLessonFilter('graded')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                    lessonFilter === 'graded'
                      ? 'bg-[#4244df] text-white shadow-xs'
                      : 'bg-[#efecff] text-[#454555] hover:text-[#1a1a2b]'
                  }`}
                >
                  {language === 'uz' ? 'Baholar' : 'Оценки'} ({allLessons.filter(l => !!l.grade).length})
                </button>
                <button
                  onClick={() => setLessonFilter('homework')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                    lessonFilter === 'homework'
                      ? 'bg-[#4244df] text-white shadow-xs'
                      : 'bg-[#efecff] text-[#454555] hover:text-[#1a1a2b]'
                  }`}
                >
                  {language === 'uz' ? 'Vazifalar' : 'ДЗ'} ({allLessons.filter(l => !!l.homeworkTask).length})
                </button>
              </div>
            </div>

            {/* List of Lessons */}
            {displayedLessons.map((lesson) => {
              const isMissedAndActive = lesson.status === 'missed' && hasActiveCatchup;
              const colorInfo = getSubjectColor(lesson.subject);

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-3xl shadow-xs border transition-all ${
                    isMissedAndActive
                      ? 'bg-[#fbd8f9]/40 border-[#fbd8f9]'
                      : 'bg-white border-[#e8e6fe]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        isMissedAndActive
                          ? 'bg-[#fbd8f9] text-[#29132c]'
                          : 'bg-[#efecff] text-[#4244df]'
                      }`}>
                        {lesson.periodNumber}-dars • {lesson.time}
                      </span>
                      <span className="text-xs text-[#767587] font-medium">{lesson.room}</span>
                    </div>

                    {lesson.grade && (
                      <div className="flex items-center gap-1.5">
                        {lesson.xp && (
                          <span className="bg-[#fbd8f9] text-[#4244df] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            +{lesson.xp} XP
                          </span>
                        )}
                        <div className="flex items-center gap-1 bg-[#dfe0ff] text-[#000e5f] px-2.5 py-0.5 rounded-full shadow-xs">
                          <span className="text-xs font-extrabold">{lesson.grade}</span>
                          <span className="text-[10px] uppercase font-bold">{lesson.gradeLabel}</span>
                        </div>
                      </div>
                    )}

                    {isMissedAndActive && (
                      <div className="flex items-center gap-1 bg-[#fbd8f9] text-[#29132c] px-2.5 py-0.5 rounded-full font-bold text-xs">
                        <span className="material-symbols-outlined text-[15px] text-[#4244df]">warning</span>
                        <span>{language === 'uz' ? 'Qoldirilgan' : 'Пропущено'}</span>
                      </div>
                    )}

                    {lesson.status === 'in_progress' && (
                      <div className="flex items-center gap-1 bg-[#e1e0ff] text-[#05006c] px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse">
                        <span className="material-symbols-outlined text-[15px] text-[#4244df]">play_circle</span>
                        <span>{language === 'uz' ? 'O\'tilmoqda' : 'Идет урок'}</span>
                      </div>
                    )}

                    {lesson.status === 'upcoming' && (
                      <div className="flex items-center gap-1 bg-[#f5f2ff] text-[#767587] px-2.5 py-0.5 rounded-full text-xs font-medium">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        <span>{language === 'uz' ? 'Kutilmoqda' : 'Предстоит'}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colorInfo.bg}`} />
                        <h3 className="text-sm font-bold text-[#1a1a2b] font-display">{lesson.subject}</h3>
                      </div>
                      <span className="text-xs text-[#767587] font-medium">{lesson.teacher}</span>
                    </div>
                    <p className="text-xs text-[#454555] mt-1 line-clamp-2">
                      <span className="font-semibold text-[#1a1a2b]">{language === 'uz' ? 'Mavzu:' : 'Тема:'} </span>
                      {lesson.topic}
                    </p>
                  </div>

                  {/* Recovery CTA if missed */}
                  {isMissedAndActive && (
                    <div className="mt-3 bg-white p-3 rounded-2xl flex items-center justify-between shadow-xs border border-[#e8e6fe]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#fbd8f9] flex items-center justify-center text-[#4244df]">
                          <span className="material-symbols-outlined text-[20px]">play_circle</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1a1a2b] block">
                            {language === 'uz' ? '8 daqiqalik tiklash darsi' : '8-минутный урок восстановления'}
                          </span>
                          <span className="text-[11px] text-[#767587]">
                            {language === 'uz' ? '+50 XP qaytarib oling' : 'Верните 0 баллов и +50 XP'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={onOpenRecovery}
                        className="bg-[#4244df] hover:bg-[#5d61f9] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>{language === 'uz' ? 'Boshlash' : 'Начать'}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {/* Homework task bar */}
                  {lesson.homeworkTask && (
                    <div className="flex items-center justify-between pt-2 mt-2 bg-[#f5f2ff] px-3 py-2 rounded-xl text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`material-symbols-outlined text-[16px] shrink-0 ${
                          lesson.homeworkSubmitted ? 'text-[#4244df]' : 'text-[#767587]'
                        }`}>
                          {lesson.homeworkSubmitted ? 'check_circle' : 'assignment'}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-[#1a1a2b]">{language === 'uz' ? 'Uy vazifasi: ' : 'ДЗ: '}</span>
                          <span className="text-[#454555]">{lesson.homeworkTask}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 font-bold px-2 py-0.5 rounded-md text-[10px] ${
                        lesson.homeworkSubmitted
                          ? 'bg-[#e1e0ff] text-[#05006c]'
                          : 'bg-[#fff4d9] text-[#8a5d00]'
                      }`}>
                        {lesson.homeworkSubmitted
                          ? language === 'uz' ? 'Topshirilgan' : 'Сдано'
                          : language === 'uz' ? 'Topshirish kerak' : 'Нужно сдать'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* MODE 2: FULL WEEKLY TIMETABLE GRID (Dushanbadan Shanbagacha) */}
      {viewMode === 'weekly' && (
        <section className="space-y-4">
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e8e6fe] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? '10-A sinf haftalik dars jadvali' : 'Расписание 10-А класса на неделю'}
              </h2>
              <p className="text-xs text-[#767587]">
                {language === 'uz' ? 'Dushanbadan Shanbagacha barcha 31 ta dars' : 'С понедельника по субботу (31 урок)'}
              </p>
            </div>
            <span className="bg-[#efecff] text-[#4244df] font-bold text-xs px-3 py-1.5 rounded-full border border-[#e8e6fe]">
              6 kunlik o'qish
            </span>
          </div>

          {/* 6-Day Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {days.map((d) => {
              const dayData = WEEKLY_TIMETABLES[d.num];
              const isToday = d.num === 17;
              return (
                <div
                  key={d.num}
                  className={`bg-white rounded-3xl p-4 shadow-xs border transition-all ${
                    isToday ? 'border-[#4244df] ring-2 ring-[#4244df]/20' : 'border-[#e8e6fe]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f8]">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isToday ? 'bg-[#4244df] text-white' : 'bg-[#efecff] text-[#4244df]'
                      }`}>
                        {d.num}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1a1a2b] font-display">
                          {d.fullNameUz}
                        </h3>
                        <span className="text-[10px] text-[#767587]">
                          {dayData?.lessons.length || 0} ta dars
                        </span>
                      </div>
                    </div>
                    {isToday && (
                      <span className="bg-[#e1e0ff] text-[#05006c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Bugun
                      </span>
                    )}
                  </div>

                  {/* Lessons list for this day */}
                  <div className="space-y-2 pt-3">
                    {dayData?.lessons.map((lesson) => {
                      const colorInfo = getSubjectColor(lesson.subject);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-start justify-between gap-1 text-xs py-1 border-b border-dashed border-[#f5f2ff] last:border-0"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#f5f2ff] text-[#4244df] font-bold text-[10px] flex items-center justify-center shrink-0">
                              {lesson.periodNumber}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-[#1a1a2b] truncate block">
                                {lesson.subject}
                              </span>
                              <span className="text-[10px] text-[#767587]">
                                {lesson.time.split(' - ')[0]} • {lesson.room}
                              </span>
                            </div>
                          </div>
                          {lesson.grade ? (
                            <span className="bg-[#dfe0ff] text-[#000e5f] font-bold text-[10px] px-1.5 py-0.5 rounded">
                              {lesson.grade}
                            </span>
                          ) : lesson.status === 'in_progress' ? (
                            <span className="bg-[#e1e0ff] text-[#05006c] font-bold text-[9px] px-1.5 py-0.5 rounded">
                              Hozir
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedDay(d.num);
                      setViewMode('daily');
                    }}
                    className="w-full mt-3 py-1.5 rounded-xl bg-[#f5f2ff] hover:bg-[#efecff] text-[#4244df] font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Kunlik darslarni ochish</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODE 3: BELL SCHEDULE (Qo'ng'iroqlar Jadvali) */}
      {viewMode === 'bell' && (
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#e8e6fe] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4244df] text-[24px]">notifications_active</span>
              <div>
                <h2 className="text-base font-bold text-[#1a1a2b] font-display">
                  {language === 'uz' ? 'Qo\'ng\'iroqlar & Dars vaqtlari jadvali' : 'Расписание звонков и перемен'}
                </h2>
                <p className="text-xs text-[#767587]">
                  {language === 'uz' ? 'Darslar 45 daqiqa davom etadi' : 'Продолжительность урока: 45 минут'}
                </p>
              </div>
            </div>
            <span className="bg-[#efecff] text-[#4244df] text-xs font-bold px-3 py-1.5 rounded-full">
              1-smena
            </span>
          </div>

          <div className="divide-y divide-[#f0f0f8]">
            {BELL_SCHEDULE.map((bell) => (
              <div key={bell.period} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#4244df] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                    {bell.period}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1a1a2b] block">
                      {bell.period}-dars
                    </span>
                    <span className="text-xs text-[#4244df] font-semibold tabular-nums">
                      {bell.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    bell.breakDuration.includes('Katta')
                      ? 'bg-[#fbd8f9] text-[#29132c] font-bold'
                      : 'bg-[#f5f2ff] text-[#767587]'
                  }`}>
                    {bell.breakDuration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weekly Study Planner Component (Interactive Drag & Drop) */}
      <WeeklyStudyPlanner language={language} />

      {/* Homework Action Card */}
      <section className="bg-white p-5 rounded-3xl shadow-xs border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4244df] text-[22px]">assignment_turned_in</span>
            <h2 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Bugunga topshiriladiganlar' : 'Задания на сегодня'}
            </h2>
          </div>
          <span className="text-[11px] bg-[#e1e0ff] text-[#4244df] px-2.5 py-0.5 rounded-full font-bold">
            2 ta faol
          </span>
        </div>

        {/* Task 1: Fizika Test */}
        <div className="p-3 bg-[#f5f2ff] rounded-2xl flex items-center justify-between gap-2 border border-[#e8e6fe]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#4244df] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#1a1a2b] truncate block">
                Fizika: 10 ta mini-test savoli
              </span>
              <span className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'AI Ustoz tomonidan lahzada tekshiriladi' : 'Проверяется ИИ мгновенно'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenHomeworkModal('physics_test')}
            className="shrink-0 bg-[#4244df] hover:bg-[#5d61f9] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            {language === 'uz' ? 'Ishlash' : 'Выполнить'}
          </button>
        </div>

        {/* Task 2: Algebra Photo */}
        <div className="p-3 bg-[#f5f2ff] rounded-2xl flex items-center justify-between gap-2 border border-[#e8e6fe]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#dfe0ff] text-[#4244df] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#1a1a2b] truncate block">
                Algebra: Mashq 126 fotosurati
              </span>
              <span className="text-[11px] text-[#767587]">
                {language === 'uz' ? 'Daftaringiz sahifasini yuklang' : 'Загрузите фото тетради'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenHomeworkModal('algebra_photo')}
            className="shrink-0 bg-[#dfe0ff] text-[#000e5f] hover:bg-[#c0c1ff] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">upload</span>
            <span>{language === 'uz' ? 'Yuklash' : 'Загрузить'}</span>
          </button>
        </div>
      </section>

      {/* Teacher Mentorship Banner */}
      <section className="bg-[#efecff] p-4 rounded-3xl flex items-center gap-3 border border-[#e8e6fe]">
        <img
          alt="Teacher Mentor"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrf54QcDRP69Qe4jUejav-GegipJviK9oPaHrgtgiCQAK-i6uwIHMoWLZua6mXGHF8zq_HD9ayxoh7GRWYcKWAmQ9Eqg6uXYQ4ux1U7mhCqXF_RJ7AHH3-2CYV-ZA6DZc0QqTwVgblRY54AzFRaqnsyN661o9SJSOzMuNryTpCwYYKMfEA7akEDhXXjQkc5L9fFxM3otfv6t-haDpAgG-mkq8zR-KJfDL9VPxU-PmYTK-3juJrDdLg"
          className="w-12 h-12 rounded-full object-cover shrink-0 shadow-xs"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[#1a1a2b] truncate">
              {language === 'uz' ? 'Savollaringiz bormi?' : 'Есть вопросы?'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#4244df]">chat_bubble</span>
          </div>
          <p className="text-[11px] text-[#454555] line-clamp-1">
            {language === 'uz'
              ? 'Sinf rahbari va fan o\'qituvchilariga xabar qoldirishingiz mumkin.'
              : 'Вы можете написать классному руководителю и учителям.'}
          </p>
        </div>
        <button
          onClick={() => onAskTeacher('D. Shavkatova')}
          className="px-3 py-1.5 bg-white text-[#4244df] hover:bg-[#4244df] hover:text-white rounded-full text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          {language === 'uz' ? 'Xabar' : 'Написать'}
        </button>
      </section>
    </div>
  );
};
