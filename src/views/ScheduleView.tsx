import React, { useState } from 'react';
import { TIMETABLE_THURSDAY } from '../data/mockData';
import { Language } from '../types';
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
  const [selectedDay, setSelectedDay] = useState(17);

  const days = [
    { num: 14, nameUz: 'Dush', nameRu: 'Пон', nameEn: 'Mon' },
    { num: 15, nameUz: 'Sesh', nameRu: 'Втор', nameEn: 'Tue' },
    { num: 16, nameUz: 'Chor', nameRu: 'Сре', nameEn: 'Wed' },
    { num: 17, nameUz: 'Pay', nameRu: 'Чет', nameEn: 'Thu', isToday: true },
    { num: 18, nameUz: 'Juma', nameRu: 'Пят', nameEn: 'Fri' },
    { num: 19, nameUz: 'Shan', nameRu: 'Суб', nameEn: 'Sat' }
  ];

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Header & Class Badge */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#4244df] uppercase tracking-wider font-display">
            {language === 'uz' ? 'Elektron Kundalik' : 'Электронный дневник'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1a2b] tracking-tight font-display">
            {language === 'uz' ? 'Jadval & Baholar' : 'Расписание и оценки'}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#efecff] px-3 py-1.5 rounded-full shadow-xs border border-[#e8e6fe]">
          <span className="material-symbols-outlined text-[18px] text-[#4244df]">school</span>
          <span className="text-xs font-bold text-[#1a1a2b]">10-A sinf</span>
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

      {/* Horizontal Weekly Calendar Strip */}
      <section className="bg-white p-4 rounded-3xl shadow-xs border border-[#e8e6fe]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4244df] text-[20px]">calendar_today</span>
            <span className="text-sm font-bold text-[#1a1a2b]">
              {selectedDay}-Oktyabr, {selectedDay === 17 ? 'Payshanba' : '2024'}
            </span>
          </div>
          {selectedDay === 17 && (
            <span className="text-[10px] bg-[#e1e0ff] text-[#05006c] px-2.5 py-0.5 rounded-full font-bold">
              Bugun
            </span>
          )}
        </div>

        <div className="flex justify-between items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
          {days.map((d) => {
            const isSelected = selectedDay === d.num;
            return (
              <button
                key={d.num}
                onClick={() => {
                  playClickSound();
                  setSelectedDay(d.num);
                }}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-2xl transition-all flex-1 min-w-[46px] ${
                  isSelected
                    ? 'bg-[#4244df] text-white shadow-md scale-[1.04]'
                    : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#454555]'
                }`}
              >
                <span className={`text-[11px] ${isSelected ? 'text-[#e1e0ff]' : 'text-[#767587]'} font-semibold`}>
                  {language === 'uz' ? d.nameUz : d.nameRu}
                </span>
                <span className="text-sm font-extrabold mt-0.5 tabular-nums">
                  {d.num}
                </span>
                {d.isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-[#fbd8f9]' : 'bg-[#4244df]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Timetable List */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
            {language === 'uz' ? 'Darslar jadvali (5 ta dars)' : 'Расписание уроков (5 уроков)'}
          </h2>
          <span className="text-xs text-[#4244df] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span> 08:30 - 13:05
          </span>
        </div>

        {TIMETABLE_THURSDAY.map((lesson) => {
          const isMissedAndActive = lesson.status === 'missed' && hasActiveCatchup;
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
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isMissedAndActive
                      ? 'bg-[#fbd8f9] text-[#29132c]'
                      : 'bg-[#efecff] text-[#4244df]'
                  }`}>
                    {lesson.periodNumber}-dars • {lesson.time}
                  </span>
                  <span className="text-xs text-[#767587]">{lesson.room}</span>
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
                    <span>Qoldirilgan</span>
                  </div>
                )}

                {lesson.status === 'in_progress' && (
                  <div className="flex items-center gap-1 bg-[#efecff] text-[#454555] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#4244df]">timer</span>
                    <span>Kutilmoqda</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1a1a2b] font-display">{lesson.subject}</h3>
                  <span className="text-xs text-[#767587]">{lesson.teacher}</span>
                </div>
                <p className="text-xs text-[#454555] mt-0.5 line-clamp-1">{lesson.topic}</p>
              </div>

              {/* Recovery CTA if missed */}
              {isMissedAndActive && (
                <div className="mt-3 bg-white p-3 rounded-2xl flex items-center justify-between shadow-xs border border-[#e8e6fe]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#fbd8f9] flex items-center justify-center text-[#4244df]">
                      <span className="material-symbols-outlined text-[20px]">play_circle</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1a1a2b] block">8 daqiqalik tiklash darsi</span>
                      <span className="text-[11px] text-[#767587]">+50 XP qaytarib oling</span>
                    </div>
                  </div>
                  <button
                    onClick={onOpenRecovery}
                    className="bg-[#4244df] hover:bg-[#5d61f9] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>Boshlash</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* Homework status bar if completed */}
              {lesson.homeworkSubmitted && (
                <div className="flex items-center justify-between pt-2 mt-2 bg-[#f5f2ff] px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-[#4244df] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{lesson.homeworkTask}</span>
                  </div>
                  <span className="text-[#767587] font-medium">{lesson.score}</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Weekly Study Planner Component (Drag & Drop) */}
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
              <span className="text-[11px] text-[#767587]">AI Ustoz tomonidan lahzada tekshiriladi</span>
            </div>
          </div>
          <button
            onClick={() => onOpenHomeworkModal('physics_test')}
            className="shrink-0 bg-[#4244df] hover:bg-[#5d61f9] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            Ishlash
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
              <span className="text-[11px] text-[#767587]">Daftaringiz sahifasini yuklang</span>
            </div>
          </div>
          <button
            onClick={() => onOpenHomeworkModal('algebra_photo')}
            className="shrink-0 bg-[#dfe0ff] text-[#000e5f] hover:bg-[#c0c1ff] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">upload</span>
            <span>Yuklash</span>
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
            <span className="text-xs font-bold text-[#1a1a2b] truncate">Savollaringiz bormi?</span>
            <span className="material-symbols-outlined text-[16px] text-[#4244df]">chat_bubble</span>
          </div>
          <p className="text-[11px] text-[#454555] line-clamp-1">
            Sinf rahbari va fan o'qituvchilariga xabar qoldirishingiz mumkin.
          </p>
        </div>
        <button
          onClick={() => onAskTeacher('D. Shavkatova')}
          className="px-3 py-1.5 bg-white text-[#4244df] hover:bg-[#4244df] hover:text-white rounded-full text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          Xabar
        </button>
      </section>
    </div>
  );
};
