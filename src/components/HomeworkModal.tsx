import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playClickSound } from '../utils/sound';
import { Language } from '../types';

interface HomeworkModalProps {
  isOpen: boolean;
  type: 'physics_test' | 'algebra_photo' | null;
  onClose: () => void;
  onComplete: (taskTitle: string, xpEarned: number) => void;
  language: Language;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  type,
  onClose,
  onComplete,
  language
}) => {
  // Test state
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([-1, -1]);
  const [isTestGraded, setIsTestGraded] = useState(false);

  // Photo upload state
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  if (!isOpen || !type) return null;

  const handleFinishTest = () => {
    setIsTestGraded(true);
    playSuccessChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      onComplete('Fizika mini-test', 25);
    }, 1500);
  };

  const handleUploadPhoto = () => {
    // Simulate instant camera capture/upload
    setUploadedPhoto('https://lh3.googleusercontent.com/aida-public/AB6AXuBvUAyfg4vwT16Sz9nP-EoL7SYVkLDf0FnqceinRaaTxFLp553-55saCauDyJx_QE0ZUwgCj-HuxFBO6EOH8IBgEMi9s-JnfDA2I96fM9UHUhhXTEw9QOyM0mCay512dMn7nY_zeHUV-HHM90B6I6dXNcw6F8R99OmHd93PbwXVKeBYIUF4AjR2y8Wurcg0vQNgPHOQ1XvtNLZdNK3vrd9cKJJGBkGRni8ln07tzE_WIettH-L48ytL');
    playSuccessChime();
    setTimeout(() => {
      onComplete('Algebra mashq 126', 20);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1a1a2b] rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 border border-[#c6c4d8]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4244df] text-[24px]">
              {type === 'physics_test' ? 'smart_toy' : 'photo_camera'}
            </span>
            <h3 className="text-sm font-bold text-[#1a1a2b] font-display">
              {type === 'physics_test'
                ? language === 'uz' ? 'Fizika: Mini-test topshirish' : 'Физика: Мини-тест'
                : language === 'uz' ? 'Algebra: Daftardan rasm yuklash' : 'Алгебра: Фото из тетради'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#f5f2ff] flex items-center justify-center text-[#767587]"
          >
            ✕
          </button>
        </div>

        {type === 'physics_test' ? (
          <div className="space-y-4">
            <p className="text-xs text-[#454555]">
              {language === 'uz'
                ? 'AI Ustoz tomonidan lahzada tekshiriladi va jurnalga baho qo\'yiladi.'
                : 'Мгновенная проверка ИИ-Учителем с выставлением в дневник.'}
            </p>

            {/* Q1 */}
            <div className="p-3 bg-[#f5f2ff] rounded-2xl space-y-2 border border-[#e3e0f8]">
              <p className="text-xs font-bold text-[#1a1a2b]">
                1. Foton energiyasi qaysi formulaga teng?
              </p>
              <div className="space-y-1">
                {['E = hf', 'E = mc²', 'F = ma'].map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      const next = [...selectedAnswers];
                      next[0] = idx;
                      setSelectedAnswers(next);
                    }}
                    className={`w-full p-2 text-xs rounded-xl text-left transition-all ${
                      selectedAnswers[0] === idx ? 'bg-[#4244df] text-white font-bold' : 'bg-white text-[#454555]'
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="p-3 bg-[#f5f2ff] rounded-2xl space-y-2 border border-[#e3e0f8]">
              <p className="text-xs font-bold text-[#1a1a2b]">
                2. Fotoeffektning qizil chegarasi nimani belgilaydi?
              </p>
              <div className="space-y-1">
                {[
                  'Elektronni urib chiqarish uchun eng minimal chastota f₀',
                  'Faqat qizil rangli nurlar chiqishi',
                  'Tokning maksimal qiymati'
                ].map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      const next = [...selectedAnswers];
                      next[1] = idx;
                      setSelectedAnswers(next);
                    }}
                    className={`w-full p-2 text-xs rounded-xl text-left transition-all ${
                      selectedAnswers[1] === idx ? 'bg-[#4244df] text-white font-bold' : 'bg-white text-[#454555]'
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            {!isTestGraded ? (
              <button
                disabled={selectedAnswers.includes(-1)}
                onClick={handleFinishTest}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                  selectedAnswers.includes(-1)
                    ? 'bg-[#c6c4d8] text-white cursor-not-allowed'
                    : 'bg-[#4244df] text-white hover:bg-[#5d61f9] active:scale-[0.98]'
                }`}
              >
                Topshirish & Bahoni olish
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-[#e1e0ff] text-[#4244df] text-center font-bold text-xs flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Baho: 5 (A'lo) • 100/100 ball qo'yildi!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#454555]">
              {language === 'uz'
                ? 'Daftaringizdagi 126-mashq yechimini rasmga olib yuklang. AI Ustoz formulalar va qadamlarni tekshiradi.'
                : 'Сфотографируйте решение упражнения 126. ИИ проверит шаги.'}
            </p>

            <div
              onClick={handleUploadPhoto}
              className="border-2 border-dashed border-[#4244df]/40 rounded-2xl p-6 text-center bg-[#f5f2ff] hover:bg-[#efecff] transition-colors cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-[#4244df] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[24px]">upload_file</span>
              </div>
              <span className="text-xs font-bold text-[#1a1a2b]">
                {uploadedPhoto ? 'Rasm yuklandi ✓' : 'Kamerani ochish yoki rasmni tanlash'}
              </span>
              <span className="text-[10px] text-[#767587]">
                JPG, PNG yoki HEIC formatida
              </span>
            </div>

            {uploadedPhoto && (
              <div className="p-2.5 bg-[#e1e0ff] text-[#4244df] rounded-xl text-xs font-bold text-center">
                Daftar sahifasi muvaffaqiyatli topshirildi (+20 XP)!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
