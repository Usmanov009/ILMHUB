import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MITOSIS_STAGES } from '../data/mockData';
import { playSuccessChime, playClickSound } from '../utils/sound';
import { Language } from '../types';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  language: Language;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  language
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(65); // percent

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([-1, -1, -1]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const quizQuestions = [
    {
      q: language === 'uz' ? 'Xromatidlar bo\'linish urchug\'i orqali qarama-qarshi qutblarga qaysi fazada tortiladi?' : 'В какой фазе сестринские хроматиды расходятся к противоположным полюсам?',
      options: [
        language === 'uz' ? 'Profaza' : 'Профаза',
        language === 'uz' ? 'Metafaza' : 'Метафаза',
        language === 'uz' ? 'Anafaza' : 'Анафаза',
        language === 'uz' ? 'Telofaza' : 'Телофаза'
      ],
      correct: 2
    },
    {
      q: language === 'uz' ? 'Metafaza bosqichida xromosomalarning holati qanday bo\'ladi?' : 'Что происходит с хромосомами во время метафазы?',
      options: [
        language === 'uz' ? 'Hujayra ekvatori bo\'ylab tekislanadi' : 'Выстраиваются по экватору клетки',
        language === 'uz' ? 'Yadro pardasi qayta tiklanadi' : 'Восстанавливается ядерная оболочка',
        language === 'uz' ? 'Xromatin tolalari erib ketadi' : 'Хроматин полностью растворяется',
        language === 'uz' ? 'Sitoplazma ikkiga ajraladi' : 'Цитоплазма делится надвое'
      ],
      correct: 0
    },
    {
      q: language === 'uz' ? 'Sitokinez hodisasi nimani anglatadi?' : 'Что означает процесс цитокинеза?',
      options: [
        language === 'uz' ? 'Sitoplazmaning bo\'linib, 2 ta qiz hujayra hosil bo\'lishi' : 'Разделение цитоплазмы на 2 дочерние клетки',
        language === 'uz' ? 'DNK ning 2 barobar ko\'payishi' : 'Репликация молекул ДНК',
        language === 'uz' ? 'Hujayraning nobud bo\'lishi' : 'Апоптоз клетки',
        language === 'uz' ? 'Xromosomalarning spiral holati' : 'Спирализация хромосом'
      ],
      correct: 0
    }
  ];

  const handleFinishRecovery = () => {
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1a1a2b] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#c6c4d8]/40">
        {/* Header */}
        <div className="p-4 bg-[#efecff] border-b border-[#e3e0f8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#fbd8f9] text-[#4244df] flex items-center justify-center font-bold text-sm shadow-xs">
              ⚡
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#4244df] uppercase tracking-wider block font-display">
                {language === 'uz' ? 'Tezkor Tiklash Rejimi • 6 daqiqa' : 'Экспресс-восстановление • 6 мин'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'Hujayra mitozi: Profazadan Telofazagacha' : 'Митоз клетки: От профазы до телофазы'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/80 flex items-center justify-center text-[#767587]"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#f5f2ff] border-b border-[#e3e0f8]">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              currentStep === 1 ? 'bg-[#4244df] text-white shadow-xs' : 'text-[#454555] hover:bg-white'
            }`}
          >
            1. {language === 'uz' ? 'Sxema Konspekt' : 'Конспект'}
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              currentStep === 2 ? 'bg-[#4244df] text-white shadow-xs' : 'text-[#454555] hover:bg-white'
            }`}
          >
            2. {language === 'uz' ? 'Video Klip' : 'Видео'}
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              currentStep === 3 ? 'bg-[#4244df] text-white shadow-xs' : 'text-[#454555] hover:bg-white'
            }`}
          >
            3. {language === 'uz' ? 'Sinov Testi' : 'Тест'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* STEP 1: Mitosis Stage Inspection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#454555] uppercase tracking-wider">
                  {language === 'uz' ? 'Mitoz bosqichlari (Tanlang)' : 'Фазы митоза (Выберите)'}
                </span>
                <span className="text-xs text-[#4244df] font-bold">
                  {activeStageIndex + 1} / {MITOSIS_STAGES.length}
                </span>
              </div>

              {/* Stage Selector Pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {MITOSIS_STAGES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      playClickSound();
                      setActiveStageIndex(idx);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      activeStageIndex === idx
                        ? 'bg-[#4244df] text-white shadow-md'
                        : 'bg-[#f5f2ff] text-[#454555] hover:bg-[#efecff]'
                    }`}
                  >
                    <span className="text-[10px] opacity-80">#{idx + 1}</span>
                    <span className="truncate w-full text-center">{s.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Stage Card */}
              <div className="bg-[#f5f2ff] rounded-2xl p-4 border border-[#e3e0f8] flex flex-col gap-3">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                  <img
                    alt={MITOSIS_STAGES[activeStageIndex].name}
                    src={MITOSIS_STAGES[activeStageIndex].imageUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-bold font-display">
                    {MITOSIS_STAGES[activeStageIndex].name} • {MITOSIS_STAGES[activeStageIndex].subtitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#4244df] uppercase tracking-wide">
                    {language === 'uz' ? 'Asosiy xususiyat' : 'Ключевая особенность'}:
                  </span>
                  <p className="text-xs text-[#1a1a2b] font-semibold">
                    {MITOSIS_STAGES[activeStageIndex].keyFeature}
                  </p>
                  <p className="text-xs text-[#454555] leading-relaxed pt-1">
                    {MITOSIS_STAGES[activeStageIndex].description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setCurrentStep(2);
                }}
                className="w-full py-2.5 bg-[#4244df] hover:bg-[#5d61f9] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-[0.98]"
              >
                <span>{language === 'uz' ? 'Keyingisi: Video klipni ko\'rish' : 'Далее: Видеоклип'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 2: Micro-clip */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                <img
                  alt="Micro video"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1uTm58PnX4JSJ8bad7x48clAS4GIij_kK3HP3fv62by1ExmVy3aTr5Z0Di3XBahP_Zozq-G9r5eBkUAEm6qkJYRZlXyCLbFFePdLWuBtmdNWmXdZ4TihReyjEvTrZDgBzvYpLUhsP_xjgGQ5CGC8M2h0lIpO6907EetvwrigaDFSGBoXmEMXBHCzm3l5PntkifJWqifukbKjfkN9N9xeWraUlpq-Pq-LyEiqTevB_PYMoYh0xgrOW"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="w-14 h-14 rounded-full bg-[#4244df] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[32px]">
                      {videoPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-1">
                  <div className="flex items-center justify-between text-white text-[10px]">
                    <span>02:15 / 03:30</span>
                    <span>Ustoz Shavkatova izohi</span>
                  </div>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      setVideoTime(Math.min(100, Math.max(0, Math.round((clickX / rect.width) * 100))));
                    }}
                    className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer"
                  >
                    <div className="bg-[#4244df] h-full" style={{ width: `${videoTime}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#efecff] rounded-xl text-xs text-[#454555] space-y-1">
                <span className="font-bold text-[#1a1a2b] block">
                  {language === 'uz' ? 'Muhim xulosa' : 'Главный вывод'}:
                </span>
                <p>
                  {language === 'uz'
                    ? 'Mitoz jarayoni bitta ona hujayradan xromosomalar soni to\'liq saqlanib qolgan (2n) ikkita bir xil qiz hujayra hosil qiladi.'
                    : 'Митоз обеспечивает образование двух генетически идентичных дочерних клеток с сохранением диплоидного набора (2n).'}
                </p>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setCurrentStep(3);
                }}
                className="w-full py-2.5 bg-[#4244df] hover:bg-[#5d61f9] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-[0.98]"
              >
                <span>{language === 'uz' ? 'Keyingisi: 3 ta savolli sinov' : 'Далее: Контрольные 3 вопроса'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 3: Mandatory Mastery Check (3 Questions) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#fbd8f9] p-3 rounded-xl text-[#1a1a2b]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4244df]">quiz</span>
                  <span className="text-xs font-bold">
                    {language === 'uz' ? 'Absence (0 ball) ni yopish testi' : 'Тест для закрытия пропуска'}
                  </span>
                </div>
                <span className="text-xs bg-white text-[#4244df] font-bold px-2 py-0.5 rounded-full">
                  +45 XP
                </span>
              </div>

              {quizQuestions.map((q, qIndex) => (
                <div key={qIndex} className="p-3.5 bg-[#f5f2ff] rounded-2xl space-y-2 border border-[#e3e0f8]">
                  <p className="text-xs font-bold text-[#1a1a2b] leading-snug">
                    {qIndex + 1}. {q.q}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIndex) => {
                      const isSelected = quizAnswers[qIndex] === oIndex;
                      const isCorrect = q.correct === oIndex;
                      let btnStyle = 'bg-white text-[#454555] hover:bg-[#efecff] border border-transparent';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-[#4244df] text-white shadow-xs font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] font-bold';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#4244df] text-white font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={oIndex}
                          disabled={quizSubmitted}
                          onClick={() => {
                            playClickSound();
                            const next = [...quizAnswers];
                            next[qIndex] = oIndex;
                            setQuizAnswers(next);
                          }}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  disabled={quizAnswers.includes(-1)}
                  onClick={() => {
                    setQuizSubmitted(true);
                    playSuccessChime();
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                    quizAnswers.includes(-1)
                      ? 'bg-[#c6c4d8] text-white cursor-not-allowed'
                      : 'bg-[#4244df] text-white hover:bg-[#5d61f9] active:scale-[0.98]'
                  }`}
                >
                  {language === 'uz' ? 'Javoblarni tekshirish' : 'Проверить ответы'}
                </button>
              ) : (
                <button
                  onClick={handleFinishRecovery}
                  className="w-full py-3 bg-[#4244df] hover:bg-[#5d61f9] text-white rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>
                    {language === 'uz' ? 'Tiklashni yakunlash & +45 XP olish' : 'Завершить восстановление & получить +45 XP'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
