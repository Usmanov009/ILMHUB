import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DUEL_QUESTIONS } from '../data/mockData';
import { playSuccessChime, playClickSound } from '../utils/sound';
import { Language } from '../types';

interface PhysicsDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnXp: (amount: number) => void;
  language: Language;
}

export const PhysicsDuelModal: React.FC<PhysicsDuelModalProps> = ({
  isOpen,
  onClose,
  onEarnXp,
  language
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [duelFinished, setDuelFinished] = useState(false);

  useEffect(() => {
    if (!isOpen || duelFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this question, move on
          handleSelect(-1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, duelFinished, questionIdx]);

  if (!isOpen) return null;

  const currentQ = DUEL_QUESTIONS[questionIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    playClickSound();
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      setUserScore((s) => s + 100);
      playSuccessChime();
    }

    // Opponent random score simulation
    const opponentCorrect = Math.random() > 0.3;
    if (opponentCorrect) {
      setOpponentScore((s) => s + 100);
    }

    setTimeout(() => {
      if (questionIdx < DUEL_QUESTIONS.length - 1) {
        setQuestionIdx((q) => q + 1);
        setSelectedOption(null);
        setTimeLeft(15);
      } else {
        setDuelFinished(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
        onEarnXp(150);
      }
    }, 1200);
  };

  const resetDuel = () => {
    setQuestionIdx(0);
    setUserScore(0);
    setOpponentScore(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setDuelFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1a1a2b] rounded-3xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 border border-[#c6c4d8]/40 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#5d61f9]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#fbd8f9] text-[#4244df] font-bold text-xs flex items-center justify-center">
              VS
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#4244df] uppercase tracking-wider block font-display">
                {language === 'uz' ? 'Jonli Duela Arenasi' : 'Арена Живых Дуэлей'}
              </span>
              <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Kvant to\'lqin funksiyalari sprinti' : 'Спринт: Квантовые волновые функции'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#f5f2ff] flex items-center justify-center text-[#767587]"
          >
            ✕
          </button>
        </div>

        {/* Live Head-to-Head Scoreboard */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#f5f2ff] border border-[#e3e0f8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4244df] text-white flex items-center justify-center text-xs font-bold font-display shadow-xs">
              J
            </div>
            <div>
              <span className="text-[10px] text-[#454555] block font-semibold">Jasur (Siz)</span>
              <span className="text-sm font-extrabold text-[#4244df] tabular-nums">{userScore} ball</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 text-right">
            <div>
              <span className="text-[10px] text-[#454555] block font-semibold">Zayd Al-Husseini</span>
              <span className="text-sm font-extrabold text-[#6e536f] tabular-nums">{opponentScore} ball</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#6e536f] text-white flex items-center justify-center text-xs font-bold font-display shadow-xs">
              Z
            </div>
          </div>
        </div>

        {!duelFinished ? (
          <>
            {/* Timer and Question Count */}
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#454555]">
                {language === 'uz' ? `Savol ${questionIdx + 1} / ${DUEL_QUESTIONS.length}` : `Вопрос ${questionIdx + 1} из ${DUEL_QUESTIONS.length}`}
              </span>
              <div className="flex items-center gap-1 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[16px] animate-pulse">timer</span>
                <span className="tabular-nums">{timeLeft}s</span>
              </div>
            </div>

            {/* Question card */}
            <div className="p-4 rounded-2xl bg-[#efecff] border border-[#e3e0f8] space-y-2">
              <p className="text-sm font-bold text-[#1a1a2b] leading-snug">{currentQ.q}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                let btnClass = 'bg-[#f5f2ff] text-[#1a1a2b] hover:bg-[#efecff] border border-transparent';
                if (selectedOption !== null) {
                  if (idx === currentQ.correct) {
                    btnClass = 'bg-[#4244df] text-white font-bold shadow-md';
                  } else if (idx === selectedOption) {
                    btnClass = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] font-bold';
                  }
                }
                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && idx === currentQ.correct && (
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Duel Complete Screen */
          <div className="py-4 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#fbd8f9] text-[#4244df] mx-auto flex items-center justify-center text-3xl shadow-lg animate-bounce">
              🏆
            </div>
            <h4 className="text-lg font-bold text-[#1a1a2b] font-display">
              {userScore >= opponentScore
                ? language === 'uz' ? 'G\'alaba! Duel Yakunlandi!' : 'Победа! Дуэль завершена!'
                : language === 'uz' ? 'Zo\'r Harakat! Durang natija!' : 'Отличная попытка! Ничья!'}
            </h4>
            <p className="text-xs text-[#454555]">
              {language === 'uz'
                ? 'Siz sinfdoshingiz ustidan yuqori natija ko\'rsatdingiz va +150 XP yutib oldingiz!'
                : 'Вы показали отличный результат в когорте и получили +150 XP!'}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-[#4244df] text-white px-4 py-2 rounded-full font-bold text-xs shadow-md">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
              <span>+150 XP • Quantum Master Badge</span>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={resetDuel}
                className="flex-1 py-2.5 rounded-xl bg-[#efecff] text-[#4244df] font-bold text-xs hover:bg-[#e3e0f8] transition-colors"
              >
                {language === 'uz' ? 'Qayta o\'ynash' : 'Играть снова'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#4244df] text-white font-bold text-xs hover:bg-[#5d61f9] transition-colors shadow-sm"
              >
                {language === 'uz' ? 'Yopish' : 'Закрыть'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
