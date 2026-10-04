import React, { useState } from 'react';
import { SUBJECTS_JOURNAL } from '../data/mockData';
import { Language, UserProfile } from '../types';
import { playClickSound } from '../utils/sound';

interface GrowthViewProps {
  user: UserProfile;
  language: Language;
  onOpenReportModal: () => void;
  onOpenDuelArena: () => void;
  onOpenRecovery: () => void;
  hasActiveCatchup: boolean;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
  user,
  language,
  onOpenReportModal,
  onOpenDuelArena,
  onOpenRecovery,
  hasActiveCatchup
}) => {
  const [activeQuarter, setActiveQuarter] = useState<'1' | '2' | '3' | '4' | 'year'>('1');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full pb-20 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Quarter Switcher & Action */}
      <section className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[11px] font-bold text-[#4244df] uppercase tracking-wider font-display">
              2024–2025 O'quv yili
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2b] font-display">
              {language === 'uz' ? 'Choraklik Baholar' : 'Четвертные оценки'}
            </h1>
          </div>
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 bg-[#efecff] hover:bg-[#e1e0ff] text-[#4244df] px-3.5 py-1.5 rounded-full shadow-xs active:scale-95 transition-all border border-[#e8e6fe]"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span className="text-xs font-bold font-display">Tabel (PDF)</span>
          </button>
        </div>

        {/* Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {[
            { id: '1', label: 'I Chorak (Joriy)' },
            { id: '2', label: 'II Chorak' },
            { id: '3', label: 'III Chorak' },
            { id: '4', label: 'IV Chorak' },
            { id: 'year', label: 'Yillik' }
          ].map((q) => (
            <button
              key={q.id}
              onClick={() => {
                playClickSound();
                setActiveQuarter(q.id as typeof activeQuarter);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeQuarter === q.id
                  ? 'bg-[#4244df] text-white shadow-xs'
                  : 'bg-[#efecff] text-[#454555] hover:bg-[#e8e6fe]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </section>

      {/* Top Mastery & Level Card */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#e1e0ff] flex items-center justify-center text-[#4244df] shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#4244df] tracking-wider uppercase font-bold font-display">
                  Current Tier
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4244df]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#1a1a2b] font-display truncate">
                Level {user.level} • {user.levelTitle}
              </h2>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#efecff] text-[#454555] text-xs font-bold">
            Top 3%
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fbd8f9] shadow-xs border border-white">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">🔥</span>
            <span className="text-xs font-bold text-[#29132c]">14-Day Study Streak</span>
          </div>
          <span className="text-[11px] text-[#4244df] font-bold bg-white px-2.5 py-0.5 rounded-full shadow-xs">
            Rank #4 in Cohort
          </span>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-[#767587]">Level 15 Goal</span>
            <span className="text-[#1a1a2b] font-bold tabular-nums">
              2,450 <span className="text-[#767587] font-normal">/ 3,000 XP</span>
            </span>
          </div>
          {/* Segmented bar */}
          <div className="grid grid-cols-5 gap-1.5 mt-2 h-2.5 w-full">
            <div className="h-full rounded-full bg-[#4244df]" />
            <div className="h-full rounded-full bg-[#4244df]" />
            <div className="h-full rounded-full bg-[#4244df]" />
            <div className="h-full rounded-full bg-[#4244df]" />
            <div className="h-full rounded-full bg-[#e1e0ff] relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-[#4244df] rounded-full" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[11px]">
            <span className="text-[#767587]">550 XP remaining</span>
            <span className="text-[#4244df] font-bold">+120 XP earned today</span>
          </div>
        </div>
      </div>

      {/* Retention Analytics & Weekly Growth Curve */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#767587] uppercase font-bold tracking-wider block font-display">
              Retention Analytics
            </span>
            <h3 className="text-base font-bold text-[#1a1a2b] font-display">Weekly Growth Curve</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#f5f2ff] px-2.5 py-1 rounded-full text-[#4244df] text-xs font-bold border border-[#e8e6fe]">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+34%</span>
          </div>
        </div>

        {/* Interactive Mastery Graph (SVG) */}
        <div className="relative w-full h-40 bg-[#f5f2ff] rounded-2xl p-3 flex flex-col justify-between overflow-hidden border border-[#e8e6fe]">
          <div className="flex justify-between items-center text-xs text-[#767587]">
            <span>Past 4 Weeks</span>
            <span className="font-bold text-[#4244df]">88% Mastery Peak</span>
          </div>

          <div className="relative w-full h-24 my-auto">
            <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 320 80">
              <defs>
                <linearGradient id="growthArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4244df" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4244df" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="growthLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#8393fe" />
                  <stop offset="100%" stopColor="#4244df" />
                </linearGradient>
              </defs>
              <line stroke="#e3e0f8" strokeDasharray="3 3" x1="0" x2="320" y1="20" y2="20" />
              <line stroke="#e3e0f8" strokeDasharray="3 3" x1="0" x2="320" y1="50" y2="50" />
              <path d="M 10 65 Q 85 58, 140 40 T 230 25 T 310 10 L 310 80 L 10 80 Z" fill="url(#growthArea)" />
              <path d="M 10 65 Q 85 58, 140 40 T 230 25 T 310 10" stroke="url(#growthLine)" strokeLinecap="round" strokeWidth="3.5" />
              <circle cx="10" cy="65" fill="#ffffff" r="4" stroke="#8393fe" strokeWidth="2.5" />
              <circle cx="140" cy="40" fill="#ffffff" r="4" stroke="#4244df" strokeWidth="2.5" />
              <circle cx="230" cy="25" fill="#ffffff" r="4" stroke="#4244df" strokeWidth="2.5" />
              <circle cx="310" cy="10" fill="#4244df" r="5" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#767587] px-1 font-semibold">
            <span>W1 (54%)</span>
            <span>W2 (67%)</span>
            <span>W3 (79%)</span>
            <span className="text-[#4244df] font-bold">W4 (88%)</span>
          </div>
        </div>

        {/* Milestone Badges Carousel */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-[#767587] font-bold uppercase tracking-wider block font-display">
            Recent Unlocked Milestones
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'm1', label: 'Mitosis Mastered', icon: 'verified' },
              { id: 'm2', label: 'Kinematics 100%', icon: 'stars' },
              { id: 'm3', label: 'Photoelectric Intro', icon: 'bolt' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setSelectedMilestone(m.label);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                  selectedMilestone === m.label
                    ? 'bg-[#4244df] text-white border-[#4244df]'
                    : 'bg-[#efecff] text-[#1a1a2b] border-[#e8e6fe] hover:bg-[#e1e0ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#4244df]">
                  {m.icon}
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Physics Duel Arena Teaser */}
      <div className="w-full bg-gradient-to-r from-[#4244df] to-[#5d61f9] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#fbd8f9]">timer</span>
              <span>Starts in 2h 15m</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#fbd8f9] flex items-center justify-center text-[#4244df] font-bold text-xs shadow-xs">
              VS
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display">Weekly Physics Duel Arena</h3>
          <p className="text-xs text-white/90">Live cohort quiz sprint: Quantum Wavefunctions</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-[#fbd8f9] text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
              <span>300 XP + Master Badge</span>
            </div>
            <button
              onClick={onOpenDuelArena}
              className="px-4 py-2 rounded-full bg-white text-[#4244df] text-xs font-bold shadow-md hover:bg-[#f5f2ff] active:scale-95 transition-all"
            >
              Join Arena
            </button>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#8393fe]/30 blur-2xl pointer-events-none" />
      </div>

      {/* Subject Proficiency Breakdown */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#767587] uppercase font-bold tracking-wider block font-display">
              Curriculum Mastery
            </span>
            <h3 className="text-base font-bold text-[#1a1a2b] font-display">Subject Proficiency</h3>
          </div>
          <span className="material-symbols-outlined text-[#4244df] text-[22px]">insights</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Math */}
          <div className="p-3 rounded-2xl bg-[#f5f2ff] flex flex-col gap-2 border border-[#e8e6fe]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4244df]">
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                </span>
                <span className="font-bold text-[#1a1a2b]">Mathematics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4244df]">94%</span>
                <span className="px-2 py-0.5 rounded-full bg-[#4244df] text-white text-[10px] font-bold">
                  Excellence
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-[#e3e0f8] rounded-full overflow-hidden">
              <div className="h-full bg-[#4244df] rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          {/* Physics */}
          <div className="p-3 rounded-2xl bg-[#f5f2ff] flex flex-col gap-2 border border-[#e8e6fe]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4244df]">
                  <span className="material-symbols-outlined text-[18px]">motion_sensor_active</span>
                </span>
                <span className="font-bold text-[#1a1a2b]">Physics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4244df]">88%</span>
                <span className="px-2 py-0.5 rounded-full bg-[#efecff] text-[#4244df] text-[10px] font-bold">
                  On Track
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-[#e3e0f8] rounded-full overflow-hidden">
              <div className="h-full bg-[#4244df] rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          {/* Chemistry */}
          <div className="p-3 rounded-2xl bg-[#f5f2ff] flex flex-col gap-2 border border-[#e8e6fe]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4244df]">
                  <span className="material-symbols-outlined text-[18px]">science</span>
                </span>
                <span className="font-bold text-[#1a1a2b]">Chemistry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1a2b]">81%</span>
                <span className="px-2 py-0.5 rounded-full bg-[#e3e0f8] text-[#1a1a2b] text-[10px] font-bold">
                  Solid
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-[#e3e0f8] rounded-full overflow-hidden">
              <div className="h-full bg-[#8393fe] rounded-full" style={{ width: '81%' }} />
            </div>
          </div>

          {/* Biology */}
          <div className="p-3 rounded-2xl bg-[#f5f2ff] flex flex-col gap-2 border border-[#e8e6fe]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4244df]">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </span>
                <span className="font-bold text-[#1a1a2b]">Biology</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#ba1a1a]">
                  {hasActiveCatchup ? '72%' : '85%'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  hasActiveCatchup ? 'bg-[#fbd8f9] text-[#29132c]' : 'bg-[#e1e0ff] text-[#4244df]'
                }`}>
                  {hasActiveCatchup ? 'Needs Catch-up' : 'Recovered ✓'}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-[#e3e0f8] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  hasActiveCatchup ? 'bg-[#6e536f]' : 'bg-[#4244df]'
                }`}
                style={{ width: hasActiveCatchup ? '72%' : '85%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fanlar Jurnali Stack */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4244df] text-[20px]">menu_book</span>
            <h2 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">Fanlar Jurnali (6)</h2>
          </div>
          <span className="text-xs text-[#767587] bg-[#efecff] px-2.5 py-0.5 rounded-full font-semibold">
            1-Chorak
          </span>
        </div>

        {SUBJECTS_JOURNAL.map((sub) => {
          const isBioWarning = sub.warning && hasActiveCatchup;
          return (
            <article
              key={sub.id}
              className={`rounded-3xl p-4 shadow-xs border space-y-3 ${
                isBioWarning
                  ? 'bg-white border-[#fbd8f9] shadow-[0_4px_16px_rgba(251,216,249,0.5)]'
                  : 'bg-white border-[#e8e6fe]'
              }`}
            >
              {isBioWarning && (
                <div className="bg-[#fbd8f9] text-[#29132c] p-2 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#4244df]">warning</span>
                    <span className="font-bold">Qayta topshirish talab etiladi</span>
                  </div>
                  <button
                    onClick={onOpenRecovery}
                    className="bg-white text-[#4244df] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs active:scale-95"
                  >
                    Topshirish
                  </button>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${sub.statusColor}`} />
                    <h3 className="text-sm font-bold text-[#1a1a2b] font-display">{sub.name}</h3>
                  </div>
                  <p className="text-[11px] text-[#767587]">O'qituvchi: {sub.teacher}</p>
                </div>

                <div className="flex flex-col items-center bg-[#e1e0ff] text-[#05006c] px-3 py-1 rounded-2xl text-center min-w-[50px]">
                  <span className="text-[9px] uppercase font-bold text-[#2928ca]">Chorak</span>
                  <span className="text-base font-extrabold leading-tight">
                    {sub.id === 'subj-3' && !hasActiveCatchup ? '4' : sub.quarterGrade}
                  </span>
                  <span className="text-[9px] font-bold text-[#4244df]">
                    {sub.id === 'subj-3' && !hasActiveCatchup ? "A'lo" : sub.gradeLabel}
                  </span>
                </div>
              </div>

              {/* Grades Chips */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#767587]">Kundalik baholar:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {sub.recentGrades.map((g, i) => (
                    <span
                      key={i}
                      className="w-7 h-7 rounded-xl bg-[#f5f2ff] text-[#4244df] text-xs flex items-center justify-center font-bold border border-[#e8e6fe]"
                    >
                      {g}
                    </span>
                  ))}
                  {isBioWarning && (
                    <span className="px-2 h-7 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[10px] flex items-center justify-center font-bold gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">close</span>
                      Qoldirilgan
                    </span>
                  )}
                </div>
              </div>

              {/* BSB Score */}
              <div className="bg-[#f5f2ff] p-2.5 rounded-2xl flex items-center justify-between text-xs border border-[#e8e6fe]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#4244df]">verified</span>
                  <div>
                    <p className="font-bold text-[#1a1a2b]">BSB-1 Nazorat bali</p>
                    <p className="text-[10px] text-[#767587]">{sub.taskTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#4244df]">{sub.bsbScore}</span>
                  <span className="text-[11px] text-[#767587]"> / 100 ball</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Documentary Vault Carousel */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#e8e6fe] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#767587] uppercase font-bold tracking-wider block font-display">
              Curated Discovery
            </span>
            <h3 className="text-base font-bold text-[#1a1a2b] font-display">Documentary Vault</h3>
          </div>
          <span className="text-xs text-[#4244df] font-bold flex items-center gap-0.5">
            View All <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {/* Card 1 */}
          <div className="w-56 shrink-0 rounded-2xl bg-[#f5f2ff] p-2.5 flex flex-col shadow-xs border border-[#e8e6fe]">
            <div className="relative w-full h-28 rounded-xl overflow-hidden">
              <img
                alt="The Quantum Frontier"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvUAyfg4vwT16Sz9nP-EoL7SYVkLDf0FnqceinRaaTxFLp553-55saCauDyJx_QE0ZUwgCj-HuxFBO6EOH8IBgEMi9s-JnfDA2I96fM9UHUhhXTEw9QOyM0mCay512dMn7nY_zeHUV-HHM90B6I6dXNcw6F8R99OmHd93PbwXVKeBYIUF4AjR2y8Wurcg0vQNgPHOQ1XvtNLZdNK3vrd9cKJJGBkGRni8ln07tzE_WIettH-L48ytL"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#4244df] shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </span>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                45m
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#4244df] font-bold">Physics • Completed</span>
              <span className="material-symbols-outlined text-[16px] text-[#4244df]">verified</span>
            </div>
            <h4 className="text-xs font-bold text-[#1a1a2b] line-clamp-1 mt-0.5">The Quantum Frontier</h4>
            <p className="text-[11px] text-[#767587] line-clamp-1">Superposition &amp; wave mechanics</p>
          </div>

          {/* Card 2 */}
          <div className="w-56 shrink-0 rounded-2xl bg-[#f5f2ff] p-2.5 flex flex-col shadow-xs border border-[#e8e6fe]">
            <div className="relative w-full h-28 rounded-xl overflow-hidden">
              <img
                alt="Architects of the Cell"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1uTm58PnX4JSJ8bad7x48clAS4GIij_kK3HP3fv62by1ExmVy3aTr5Z0Di3XBahP_Zozq-G9r5eBkUAEm6qkJYRZlXyCLbFFePdLWuBtmdNWmXdZ4TihReyjEvTrZDgBzvYpLUhsP_xjgGQ5CGC8M2h0lIpO6907EetvwrigaDFSGBoXmEMXBHCzm3l5PntkifJWqifukbKjfkN9N9xeWraUlpq-Pq-LyEiqTevB_PYMoYh0xgrOW"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-[#4244df] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </span>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                32m
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#6e536f] font-bold">Biology • Catch-up</span>
              <span className="px-1.5 py-0.2 rounded bg-[#fbd8f9] text-[#4244df] font-bold text-[9px]">Rec</span>
            </div>
            <h4 className="text-xs font-bold text-[#1a1a2b] line-clamp-1 mt-0.5">Architects of the Cell</h4>
            <p className="text-[11px] text-[#767587] line-clamp-1">Mitochondrial energy pathways</p>
          </div>

          {/* Card 3 */}
          <div className="w-56 shrink-0 rounded-2xl bg-[#f5f2ff] p-2.5 flex flex-col shadow-xs border border-[#e8e6fe]">
            <div className="relative w-full h-28 rounded-xl overflow-hidden">
              <img
                alt="Spacetime Geometries"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkEEVnpCQUC6IJYfg3GsTEA2VcFQzPecbltszFnQb3y9oabxDvPZ6bZztsm6ymcgSixbFMcQNv5qDSRUk0H3uvaOLqWGf2OSSN_b2ABAMnoO1F3qWAN53PlqP5O_FZvrDmpGmnXxfUaJLhMX4zahvJa-Tf66sYursh-VArDiMkxQynIXd8nPmtbViND_jpHhcBvX3MzsQk6H4aT3v75C-lfWjGCeePo0EDRVut4GyKJu8DgU4edbfa"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                54m
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#767587] font-semibold">Astronomy</span>
              <span className="material-symbols-outlined text-[16px] text-[#767587]">bookmark_border</span>
            </div>
            <h4 className="text-xs font-bold text-[#1a1a2b] line-clamp-1 mt-0.5">Spacetime Geometries</h4>
            <p className="text-[11px] text-[#767587] line-clamp-1">General relativity unpacked</p>
          </div>
        </div>
      </div>
    </div>
  );
};
