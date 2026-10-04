import React, { useState } from 'react';
import { CATCHUP_MODULE, MITOSIS_STAGES } from '../data/mockData';
import { Language } from '../types';
import { playClickSound } from '../utils/sound';

interface RecoveryViewProps {
  language: Language;
  onOpenRecoveryModal: () => void;
  onAskAi: (prompt: string) => void;
  hasActiveCatchup: boolean;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({
  language,
  onOpenRecoveryModal,
  onAskAi,
  hasActiveCatchup
}) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Catch-up Context Header */}
      <div className="flex flex-col space-y-1 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fbd8f9] text-[#4244df] shadow-xs">
              <span className="material-symbols-outlined text-[18px]">auto_mode</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Qoldirilgan Darslarni Tiklash Markazi' : 'Центр восстановления пропусков'}
            </h2>
          </div>
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold font-display ${
            hasActiveCatchup ? 'bg-[#e1e0ff] text-[#4244df]' : 'bg-[#e8e6fe] text-[#767587]'
          }`}>
            {hasActiveCatchup ? '1 Faol' : 'Hammasi tiklangan ✓'}
          </span>
        </div>
        <p className="text-xs text-[#454555]">
          {language === 'uz'
            ? 'Maqsadli 8 daqiqalik mikro-darslar bilan bilimlardagi bo\'shliqlarni to\'ldiring.'
            : 'Ликвидируйте пробелы в знаниях за 8-минутные микро-сессии.'}
        </p>
      </div>

      {/* Featured Missed Lesson Card */}
      {hasActiveCatchup ? (
        <div className="relative w-full rounded-3xl bg-white p-5 shadow-[0_12px_28px_-6px_rgba(66,68,223,0.12)] border border-[#e8e6fe] overflow-hidden space-y-4">
          {/* Luminous Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#dfe0ff]/50 blur-2xl pointer-events-none" />

          {/* Alert Banner */}
          <div className="relative flex items-center justify-between bg-[#fbd8f9] text-[#29132c] px-3.5 py-2 rounded-2xl shadow-[0_0_16px_rgba(251,216,249,0.7)] border border-white">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#4244df]">warning</span>
              <span className="text-xs font-bold truncate font-display">
                Missed Yesterday • Grade 10 Biology
              </span>
            </div>
            <span className="text-[10px] font-bold bg-white/90 text-[#1a1a2b] px-2.5 py-0.5 rounded-full shrink-0 shadow-xs font-display">
              Priority #1
            </span>
          </div>

          {/* Title & Teacher Note */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a2b] font-display leading-tight">
                {CATCHUP_MODULE.title}
              </h3>
              <span className="shrink-0 flex items-center gap-1 text-[11px] text-[#4244df] bg-[#efecff] px-2.5 py-1 rounded-xl font-bold">
                <span className="material-symbols-outlined text-[15px]">schedule</span> 6 min
              </span>
            </div>

            <div className="flex items-start gap-2.5 bg-[#f5f2ff] p-3 rounded-2xl border border-[#e8e6fe]">
              <div className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#e1e0ff]">
                <img
                  alt="Ustoz Shavkatova"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWrYV3TZBe6A2DrKkaLWd49nhLu1NR20oZ30mAhRjwYRuxWe46wYAoUY0uAgLHO8MsERb1QtokkBCb3bz7IR4c78ON3POgzFPCl2ZI9pLG4iEGKKtlf3Hmq1cTY4KaP4FpgEXEx2mMVA_Q4Bib6XhnUX6xO883jcZjGwsEkcCtoz0Tr3yRJva4dgDgajN8kAW2IUmOaSmVU8UKIL2PuKUQgKxeSqDDMGheSAGaVlIKCmlJpGu1vOST"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-[#454555] leading-relaxed">
                <strong className="text-[#1a1a2b] font-bold">{CATCHUP_MODULE.teacher}:</strong>{' '}
                {CATCHUP_MODULE.teacherNote}
              </p>
            </div>
          </div>

          {/* Mitosis Stages Interactive Micro-Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#767587] uppercase tracking-wider font-display">
                Mitosis Stages Breakdown
              </span>
              <span className="text-[11px] text-[#4244df] font-bold">
                Bosing &amp; Ko'ring
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {MITOSIS_STAGES.map((stg) => (
                <div
                  key={stg.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedStage(stg.id === selectedStage ? null : stg.id);
                  }}
                  className={`shrink-0 w-32 p-2 rounded-2xl shadow-xs flex flex-col space-y-1.5 transition-all cursor-pointer border ${
                    selectedStage === stg.id
                      ? 'bg-[#efecff] border-[#4244df] scale-105'
                      : 'bg-[#f5f2ff] hover:bg-[#efecff] border-[#e8e6fe]'
                  }`}
                >
                  <div className="h-16 w-full rounded-xl overflow-hidden bg-[#e1e0ff] relative shadow-inner">
                    <img
                      alt={stg.name}
                      src={stg.imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-white/90 px-1.5 py-0.2 rounded font-bold text-[#4244df]">
                      {stg.id}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1a1a2b]">{stg.name}</span>
                  <span className="text-[10px] text-[#767587] line-clamp-1">{stg.subtitle}</span>
                </div>
              ))}
            </div>

            {/* Selected Stage Detail Drawer */}
            {selectedStage !== null && (
              <div className="p-3 bg-[#e1e0ff] rounded-2xl text-xs space-y-1 text-[#05006c] animate-in fade-in">
                <span className="font-bold block">
                  {MITOSIS_STAGES[selectedStage - 1].name}: {MITOSIS_STAGES[selectedStage - 1].subtitle}
                </span>
                <p>{MITOSIS_STAGES[selectedStage - 1].description}</p>
              </div>
            )}
          </div>

          {/* Smart Recovery Breakdown Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-[#767587] uppercase tracking-wider font-display">
              Fast-Track Steps
            </span>

            {/* Step 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] border border-[#e8e6fe]">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4244df] text-white shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#1a1a2b] truncate">Key Concept Digest</span>
                  <span className="text-[11px] text-[#767587] truncate">3 min read &amp; diagram review</span>
                </div>
              </div>
              <span className="text-[10px] text-[#4244df] font-bold px-2 py-0.5 rounded-full bg-[#e1e0ff] shrink-0">
                Done
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-2xl bg-[#f5f2ff] space-y-2 border border-[#e8e6fe]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#5d61f9] text-white shrink-0">
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1a1a2b] truncate">Documentary Micro-Clip</span>
                    <span className="text-[11px] text-[#767587] truncate">3 min video • Ustoz Commentary</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#4454bb] shrink-0">65%</span>
              </div>
              <div className="w-full bg-[#dfe0ff] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#4244df] h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={onOpenRecoveryModal}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#f5f2ff] hover:bg-[#efecff] cursor-pointer transition-colors border border-[#e8e6fe]"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#e8e6fe] text-[#767587] shrink-0">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#1a1a2b] truncate">Mandatory Mastery Check</span>
                  <span className="text-[11px] text-[#767587] truncate">3 Questions to clear absence</span>
                </div>
              </div>
              <span className="text-[10px] text-[#4244df] font-bold bg-[#e1e0ff] px-2.5 py-0.5 rounded-full shrink-0">
                Topshirish →
              </span>
            </div>
          </div>

          {/* Gamification Reward Callout */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#fbd8f9] text-[#29132c] shadow-[0_0_16px_rgba(251,216,249,0.8)] border border-white">
            <div className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#4244df] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight font-display">
                Regain 100% Attendance Streak
              </span>
              <span className="text-[11px] text-[#583e59] leading-tight">
                Earn +45 XP &amp; unlock cohort badge upon finishing this module
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onOpenRecoveryModal}
              className="w-full h-12 bg-[#4244df] hover:bg-[#5d61f9] active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-[0_8px_16px_-4px_rgba(66,68,223,0.35)] flex items-center justify-center space-x-2 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Start 6-Minute Fast-Track Recovery</span>
            </button>
            <button
              onClick={() => onAskAi('Hujayra mitozi bosqichlarini tushuntir')}
              className="w-full h-11 bg-[#efecff] hover:bg-[#e8e6fe] active:scale-[0.98] text-[#4244df] rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span>Ask AI Tutor to Explain Stages</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed State */
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e8e6fe] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#fbd8f9] text-[#4244df] mx-auto flex items-center justify-center text-2xl shadow-md">
            ✓
          </div>
          <h3 className="text-lg font-bold text-[#1a1a2b] font-display">
            Ajoyib! Barcha qoldirilgan darslar tiklangan!
          </h3>
          <p className="text-xs text-[#454555]">
            Davomat darajangiz 100% ga qaytarildi va +45 XP hisobingizga qo'shildi.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1e0ff] text-[#4244df] rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>100% Davomat Nishoni Faol</span>
          </div>
        </div>
      )}

      {/* Catch-up History & Cohort Tracks */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
            Catch-up History &amp; Cohort Tracks
          </h3>
          <span className="text-xs text-[#4244df] font-bold">View Log</span>
        </div>

        {/* History item 1 */}
        <div className="w-full bg-white rounded-3xl p-3.5 shadow-xs border border-[#e8e6fe] flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#efecff] flex items-center justify-center text-[#4244df] shrink-0">
              <span className="material-symbols-outlined text-[20px]">functions</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#1a1a2b] truncate">
                Quadratic Inequalities &amp; Parabola
              </span>
              <span className="text-[11px] text-[#767587] truncate">Algebra • Missed 3 days ago</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-0.5 shrink-0 ml-2">
            <span className="text-[10px] font-bold text-white bg-[#4244df] px-2.5 py-0.5 rounded-full">
              Recovered
            </span>
            <span className="text-[11px] text-[#767587] font-semibold">+50 XP</span>
          </div>
        </div>

        {/* History item 2 */}
        <div className="w-full bg-white rounded-3xl p-3.5 shadow-xs border border-[#e8e6fe] flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#efecff] flex items-center justify-center text-[#4454bb] shrink-0">
              <span className="material-symbols-outlined text-[20px]">code</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#1a1a2b] truncate">
                Python OOP: Classes &amp; Self Methods
              </span>
              <span className="text-[11px] text-[#767587] truncate">CompSci • Live Cohort</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-0.5 shrink-0 ml-2">
            <span className="text-[10px] font-bold text-[#4454bb] bg-[#e1e0ff] px-2.5 py-0.5 rounded-full">
              On Track
            </span>
            <span className="text-[11px] text-[#767587] font-semibold">Tomorrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
