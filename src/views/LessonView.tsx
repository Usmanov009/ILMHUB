import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playClickSound } from '../utils/sound';
import { Language } from '../types';

interface LessonViewProps {
  language: Language;
  onOpenRecovery: () => void;
  onOpenTranscript: () => void;
  onAskAi: (prompt: string) => void;
  onEarnXp: (amount: number) => void;
  hasActiveCatchup: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  language,
  onOpenRecovery,
  onOpenTranscript,
  onAskAi,
  onEarnXp,
  hasActiveCatchup
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeConcept, setActiveConcept] = useState<1 | 2 | 3>(1);

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);

  // Peer discussion state
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionReplies, setDiscussionReplies] = useState([
    {
      author: 'AI Tutor',
      role: 'Tutor',
      text: 'Think of the work function as a vending machine that costs $2.00 (blue photon). Red light photons are only $1.00 each. Feeding 1,000 $1.00 bills together into a slot that requires a single $2 coin won\'t give you the snack!',
      time: '12m ago'
    },
    {
      author: 'Malika Karimova',
      role: 'Peer',
      text: 'Because photoelectric emission is an instantaneous 1-to-1 interaction between one photon and one electron!',
      time: '8m ago'
    }
  ]);
  const [newReply, setNewReply] = useState('');

  const handleSelectQuiz = (optionIdx: number) => {
    if (isQuizAnswered) return;
    playClickSound();
    setSelectedQuizOption(optionIdx);
    setIsQuizAnswered(true);

    if (optionIdx === 0) {
      playSuccessChime();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      onEarnXp(10);
    }
  };

  const handleAddReply = () => {
    if (!newReply.trim()) return;
    playSuccessChime();
    setDiscussionReplies((prev) => [
      ...prev,
      {
        author: 'Jasur (Siz)',
        role: 'Student',
        text: newReply.trim(),
        time: 'Hozirgina'
      }
    ]);
    setNewReply('');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Top Priority Catch-up Callout */}
      {hasActiveCatchup && (
        <div className="w-full bg-[#fbd8f9] text-[#4244df] rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden border border-white">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#debcdd]/40 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shrink-0 shadow-xs text-[#4244df]">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#583e59] uppercase tracking-wider font-bold font-display">
                Priority Catch-Up
              </span>
              <span className="text-xs sm:text-sm text-[#1a1a2b] truncate font-bold font-display">
                1 Missed Class: Biology • Cell Mitosis
              </span>
            </div>
          </div>
          <button
            onClick={onOpenRecovery}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#4244df] text-white text-xs font-bold shadow-[0_4px_12px_rgba(66,68,223,0.28)] hover:bg-[#5d61f9] active:scale-95 transition-all"
          >
            Catch Up Now
          </button>
        </div>
      )}

      {/* Breadcrumbs & Header Section */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[#454555] text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#4244df]">school</span>
            <span>Grade 10</span>
            <span className="text-[#c6c4d8]">•</span>
            <span className="text-[#4244df] font-bold">Physics</span>
            <span className="text-[#c6c4d8]">•</span>
            <span className="truncate">Unit 4: Modern Waves</span>
          </div>
          <div className="flex items-center gap-1 bg-[#efecff] text-[#4244df] px-2.5 py-1 rounded-full shrink-0 shadow-xs border border-[#e8e6fe]">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            <span className="text-[11px] font-bold whitespace-nowrap">+30 XP</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a1a2b] tracking-tight mt-0.5 font-display">
          Quantum Physics: Dual Nature of Light & Photoelectric Effect
        </h1>

        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#767587]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">schedule</span> 18 min module
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">group</span> Cohort 24B
          </span>
        </div>
      </div>

      {/* Documentary Video Player Card */}
      <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col group border border-[#e8e6fe]">
        <div className="relative w-full aspect-video bg-[#1a1a2b] overflow-hidden">
          <img
            alt="Quantum Photons Striking Zinc"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKVdzCGfyzfNYrRnkJmeqYaaGR1VtI-6PQb5iWhj0HWVL_O3fQPvEklA-ghH4MFvubTW0EK7ZSfqzTJnWHNCTrzyIy4asy-vdreiyit5-hfReL1FT7oToYn4VFahVGmZq0QIisubqKiPGR9wjwPgT31e_vALwPQuOn4ii_GDtlUftxO753WYgvq8g0Ol390Zi7DgV5wbWGvFY_Iq68ZmEnYsqtA7MvNlicfjY2B3C9LTtBW3Q-beUO"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Video Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 flex flex-col justify-between p-3.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">smart_display</span>
                <span className="text-[11px] text-[#1a1a2b] font-bold">Curated YouTube Documentary (4K)</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tabular-nums">
                12:45
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  playClickSound();
                  setIsPlaying(!isPlaying);
                }}
                className="w-14 h-14 rounded-full bg-[#4244df] hover:bg-[#5d61f9] text-white flex items-center justify-center shadow-[0_0_24px_rgba(66,68,223,0.55)] hover:scale-110 active:scale-95 transition-all p-3"
              >
                <span className="material-symbols-outlined text-[32px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between text-white text-[11px]">
              <span className="flex items-center gap-1 opacity-90">
                <span className="material-symbols-outlined text-[14px]">high_quality</span> 2160p Ultra HD
              </span>
              <span className="opacity-90">Narrated by Dr. E. Thorne</span>
            </div>
          </div>
        </div>

        {/* Video Sub-actions */}
        <div className="p-3 bg-[#f5f2ff] flex items-center justify-between gap-2 border-t border-[#e8e6fe]">
          <button
            onClick={onOpenTranscript}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#efecff] text-[#4244df] text-xs font-bold shadow-xs transition-colors border border-[#e8e6fe]"
          >
            <span className="material-symbols-outlined text-[18px]">subtitles</span>
            <span>Synchronized Interactive Transcript (Live)</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setBookmarked(!bookmarked);
            }}
            className={`p-2 rounded-xl bg-white hover:bg-[#efecff] shadow-xs transition-colors border border-[#e8e6fe] ${
              bookmarked ? 'text-[#4244df]' : 'text-[#767587]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {bookmarked ? 'bookmark' : 'bookmark_add'}
            </span>
          </button>
        </div>
      </div>

      {/* Key Conceptual Insights: Swipeable Concept Cards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#4244df]">auto_stories</span>
            <h2 className="text-base font-bold text-[#1a1a2b] font-display">Key Conceptual Insights</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveConcept(1)}
              className={`h-1.5 rounded-full transition-all ${activeConcept === 1 ? 'w-5 bg-[#4244df]' : 'w-1.5 bg-[#e3e0f8]'}`}
            />
            <button
              onClick={() => setActiveConcept(2)}
              className={`h-1.5 rounded-full transition-all ${activeConcept === 2 ? 'w-5 bg-[#4244df]' : 'w-1.5 bg-[#e3e0f8]'}`}
            />
            <button
              onClick={() => setActiveConcept(3)}
              className={`h-1.5 rounded-full transition-all ${activeConcept === 3 ? 'w-5 bg-[#4244df]' : 'w-1.5 bg-[#e3e0f8]'}`}
            />
          </div>
        </div>

        {/* Concept Content */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-md flex flex-col gap-3 relative overflow-hidden border border-[#e8e6fe]">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#e1e0ff]/50 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e1e0ff] text-[#4244df] text-[11px] font-bold font-display">
              Concept {activeConcept} of 3
            </span>
            <span className="text-[11px] text-[#767587] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">psychology</span> 3 min read
            </span>
          </div>

          {activeConcept === 1 && (
            <>
              <div>
                <h3 className="text-base font-bold text-[#1a1a2b] font-display">
                  Planck's Postulate & Energy of Photons
                </h3>
                <p className="text-xs text-[#454555] mt-1 leading-relaxed">
                  Light is not emitted continuously, but in discrete packets of localized quantum energy termed{' '}
                  <span className="text-[#4244df] font-bold">photons</span> or quanta.
                </p>
              </div>

              {/* Equation Box */}
              <div className="p-3.5 bg-[#f5f2ff] rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xs border border-[#e8e6fe]">
                <span className="text-[10px] text-[#767587] font-bold tracking-wider uppercase font-display">
                  Planck-Einstein Relation
                </span>
                <div className="flex items-center gap-3 py-1 text-[#4244df]">
                  <span className="text-xl font-bold font-mono tracking-tight">E = hf</span>
                  <span className="text-[#767587] text-sm font-sans">or</span>
                  <span className="text-xl font-bold font-mono tracking-tight">E = hc / λ</span>
                </div>
                <span className="text-[11px] text-[#767587] italic">
                  where h = 6.626 × 10⁻³⁴ J·s (Planck's Constant)
                </span>
              </div>

              {/* Key Bullets */}
              <div className="flex flex-col gap-2 pt-1 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#efecff] flex items-center justify-center shrink-0 mt-0.5 text-[#4244df]">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <p className="text-[#1a1a2b]">
                    Photon energy is strictly proportional to optical frequency (<strong>f</strong>), invariant of wave amplitude or beam intensity.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#efecff] flex items-center justify-center shrink-0 mt-0.5 text-[#4244df]">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <p className="text-[#1a1a2b]">
                    Intensity governs solely the flux count (rate of photons per second), not individual projectile impact energy.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeConcept === 2 && (
            <>
              <div>
                <h3 className="text-base font-bold text-[#1a1a2b] font-display">
                  Einstein's Photoelectric Equation & Energy Conservation
                </h3>
                <p className="text-xs text-[#454555] mt-1 leading-relaxed">
                  When a photon strikes a surface electron, all its energy is transferred instantly. Part of it is used to overcome the binding energy (work function), and the rest becomes kinetic energy.
                </p>
              </div>

              <div className="p-3.5 bg-[#f5f2ff] rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xs border border-[#e8e6fe]">
                <span className="text-[10px] text-[#767587] font-bold tracking-wider uppercase font-display">
                  Maximum Kinetic Energy
                </span>
                <div className="flex items-center gap-3 py-1 text-[#4244df]">
                  <span className="text-xl font-bold font-mono tracking-tight">KE_max = hf - Φ</span>
                </div>
                <span className="text-[11px] text-[#767587] italic">
                  where Φ is the work function (W = hf₀)
                </span>
              </div>
            </>
          )}

          {activeConcept === 3 && (
            <>
              <div>
                <h3 className="text-base font-bold text-[#1a1a2b] font-display">
                  Stopping Potential & Cut-off Frequency
                </h3>
                <p className="text-xs text-[#454555] mt-1 leading-relaxed">
                  Applying a retarding voltage V₀ halts the most energetic photoelectrons: e·V₀ = KE_max. Measuring V₀ reveals the exact frequency-to-energy ratio!
                </p>
              </div>

              <div className="p-3.5 bg-[#f5f2ff] rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xs border border-[#e8e6fe]">
                <span className="text-[10px] text-[#767587] font-bold tracking-wider uppercase font-display">
                  Stopping Potential Equation
                </span>
                <div className="flex items-center gap-3 py-1 text-[#4244df]">
                  <span className="text-xl font-bold font-mono tracking-tight">e · V₀ = h(f - f₀)</span>
                </div>
                <span className="text-[11px] text-[#767587] italic">
                  Slope of V₀ vs f equals h/e
                </span>
              </div>
            </>
          )}

          {/* Progress Indicator */}
          <div className="w-full bg-[#efecff] h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#4244df] h-full rounded-full transition-all duration-300"
              style={{ width: `${(activeConcept / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quiz & Reinforcement Section */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-md flex flex-col gap-3 border border-[#e8e6fe]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#8393fe] text-[#0f238e] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[16px]">quiz</span>
            </div>
            <span className="text-sm font-bold text-[#1a1a2b] font-display">Knowledge Checkpoint</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#fbd8f9] text-[#4244df] text-[11px] font-bold">
            Single Choice
          </span>
        </div>

        <p className="text-sm font-bold text-[#1a1a2b] leading-snug">
          What happens to photoelectrons when the frequency of incident light exceeds the threshold frequency (f &gt; f₀)?
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2 mt-1">
          {/* Option A */}
          <div
            onClick={() => handleSelectQuiz(0)}
            className={`w-full p-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all border ${
              selectedQuizOption === 0
                ? 'bg-[#4244df] text-white border-[#4244df]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#1a1a2b] border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  selectedQuizOption === 0 ? 'bg-white text-[#4244df]' : 'bg-[#e8e6fe] text-[#454555]'
                }`}
              >
                A
              </div>
              <span className="text-xs font-semibold leading-tight">
                Electrons are immediately ejected with kinetic energy (KE = hf - Φ)
              </span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
              {selectedQuizOption === 0 ? (
                <span className="material-symbols-outlined text-[20px] text-white">check_circle</span>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#c6c4d8]" />
              )}
            </div>
          </div>

          {/* Option B */}
          <div
            onClick={() => handleSelectQuiz(1)}
            className={`w-full p-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all border ${
              selectedQuizOption === 1
                ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#1a1a2b] border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#e8e6fe] text-[#454555] flex items-center justify-center shrink-0 text-xs font-bold">
                B
              </div>
              <span className="text-xs font-semibold leading-tight">
                No ejection occurs regardless of wave intensity or beam focus
              </span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
              <div className="w-4 h-4 rounded-full border-2 border-[#c6c4d8]" />
            </div>
          </div>

          {/* Option C */}
          <div
            onClick={() => handleSelectQuiz(2)}
            className={`w-full p-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all border ${
              selectedQuizOption === 2
                ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]'
                : 'bg-[#f5f2ff] hover:bg-[#efecff] text-[#1a1a2b] border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#e8e6fe] text-[#454555] flex items-center justify-center shrink-0 text-xs font-bold">
                C
              </div>
              <span className="text-xs font-semibold leading-tight">
                Only thermal heat is absorbed into the crystalline matrix
              </span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
              <div className="w-4 h-4 rounded-full border-2 border-[#c6c4d8]" />
            </div>
          </div>
        </div>

        {/* Instant Feedback Banner */}
        <div className="mt-2 p-3 bg-[#f5f2ff] rounded-2xl flex items-center justify-between gap-2 border border-[#e8e6fe]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fbd8f9] text-[#4244df] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a1a2b]">
                {isQuizAnswered && selectedQuizOption === 0 ? 'Correct! +10 XP earned' : 'Instant Feedback Ready'}
              </span>
              <span className="text-[11px] text-[#767587]">Instant emission occurs in under 10⁻⁹s</span>
            </div>
          </div>
          <button
            onClick={() => setShowAiHint(!showAiHint)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8393fe] text-[#0f238e] text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            <span>AI Hint</span>
          </button>
        </div>

        {showAiHint && (
          <div className="p-3 bg-[#e1e0ff] text-[#05006c] rounded-2xl text-xs space-y-1 animate-in fade-in">
            <span className="font-bold block">💡 AI Repetitor maslahati:</span>
            <p>
              f &gt; f₀ bo'lganda, har bir tushayotgan foton energiyasi (hf) metalldan elektronni uzib olish uchun sarflanadigan chiqish ishi Φ dan katta bo'ladi. Ortiqcha energiya elektronning kinetik energiyasiga aylanadi!
            </p>
          </div>
        )}
      </div>

      {/* Cohort Peer Question & Discussion Card */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-md flex flex-col gap-3 border border-[#e8e6fe]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              alt="Student Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALEy6mOpF23PJ58mgg7n92nxyldVwoduJYWfD_L2iwL7KAV4M6_HmK6zO13gq6gyqaBPpvjf_f696IK1c11wSt2Kx7lYCUY-Avn61YMPbQapbGsYjJoTrR1Jk6Xyr0XI0_XdlWi32WLz1mjPkuRSZE8OpKWsW_yZbsIJF3WiMHNOJGAYeGt9L4JPlU9KiEVPwcJkf5FfD_WmXiw-WRhTa6dQ_XPm6MkqcBGyBQEvX8U9AICrrefHMW"
              className="w-8 h-8 rounded-full object-cover shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a1a2b]">Zayd Al-Husseini</span>
              <span className="text-[10px] text-[#767587]">Asked 14m ago • Cohort Discussion</span>
            </div>
          </div>
          <span className="text-xs text-[#4244df] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">mode_comment</span>
            <span>{discussionReplies.length} replies</span>
          </span>
        </div>

        <p className="text-xs text-[#454555] bg-[#f5f2ff] p-3 rounded-2xl leading-relaxed border border-[#e8e6fe]">
          “Why doesn't boosting red laser light brightness cause any photoemission even at huge power levels?”
        </p>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-[#767587] text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-[#4244df]">psychology_alt</span>
            <span>AI Tutor answered with wave-particle analogy</span>
          </div>
          <button
            onClick={() => setShowDiscussionModal(true)}
            className="text-xs text-[#4244df] font-bold hover:underline flex items-center gap-0.5"
          >
            <span>View Discussion</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Quick AI Prompt Pill */}
      <div className="sticky bottom-2 z-40 w-full pt-1">
        <div className="w-full bg-white/95 backdrop-blur-xl p-2.5 rounded-full shadow-[0_12px_32px_rgba(66,68,223,0.18)] flex items-center justify-between gap-2 border border-[#e8e6fe]">
          <div className="flex items-center gap-2.5 pl-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4244df] to-[#8393fe] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#4244df] font-bold uppercase tracking-wider font-display">
                Interactive Prompt
              </span>
              <span className="text-xs text-[#1a1a2b] font-semibold truncate">
                Ask AI Tutor about “E = hf & work function”
              </span>
            </div>
          </div>
          <button
            onClick={() => onAskAi('E = hf va chiqish ishi (work function) haqida tushuntir')}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4244df] hover:bg-[#5d61f9] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">spark</span>
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Discussion Modal */}
      {showDiscussionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-[#1a1a2b] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#c6c4d8]/40">
            <div className="p-4 bg-[#efecff] border-b border-[#e3e0f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4244df]">forum</span>
                <h3 className="text-sm font-bold text-[#1a1a2b] font-display">Cohort Discussion Thread</h3>
              </div>
              <button
                onClick={() => setShowDiscussionModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#767587]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="p-3 bg-[#f5f2ff] rounded-2xl border border-[#e8e6fe] space-y-1">
                <span className="text-[10px] font-bold text-[#4244df] uppercase">Savol:</span>
                <p className="text-xs font-semibold text-[#1a1a2b]">
                  “Why doesn't boosting red laser light brightness cause any photoemission even at huge power levels?”
                </p>
              </div>

              {discussionReplies.map((reply, i) => (
                <div key={i} className="p-3 bg-white rounded-2xl border border-[#e8e6fe] space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1a1a2b]">{reply.author}</span>
                    <span className="text-[10px] text-[#767587]">{reply.time}</span>
                  </div>
                  <p className="text-xs text-[#454555] leading-relaxed">{reply.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#f5f2ff] border-t border-[#e3e0f8] flex items-center gap-2">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddReply();
                }}
                placeholder="Fikringizni yozing..."
                className="flex-1 bg-white text-xs px-3 py-2 rounded-xl outline-none border border-[#e8e6fe]"
              />
              <button
                onClick={handleAddReply}
                className="px-3.5 py-2 bg-[#4244df] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
