import React from 'react';
import { SUBJECTS_JOURNAL } from '../data/mockData';
import { Language, UserProfile } from '../types';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  language: Language;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  user,
  language
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1a1a2b] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#c6c4d8]/40">
        {/* Modal Header */}
        <div className="p-4 bg-[#efecff] border-b border-[#e3e0f8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4244df] text-[24px]">school</span>
            <div>
              <span className="text-[10px] font-bold text-[#4244df] uppercase tracking-wider block font-display">
                {language === 'uz' ? 'O\'zbekiston Respublikasi Maktabgacha va Maktab Ta\'limi Vazirligi' : 'Министерство Дошкольного и Школьного Образования'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a2b] font-display">
                {language === 'uz' ? 'I-Choraklik Akademik Tabel (2024–2025)' : 'Табель успеваемости за I-четверть (2024–2025)'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#767587]"
          >
            ✕
          </button>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Student Profile Block */}
          <div className="p-4 bg-[#f5f2ff] rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 border border-[#e3e0f8]">
            <div>
              <span className="text-[#767587] block text-[10px]">O'quvchi / Ученик:</span>
              <span className="font-bold text-[#1a1a2b] text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-[#767587] block text-[10px]">Sinf / Класс:</span>
              <span className="font-bold text-[#1a1a2b] text-sm">{user.grade}</span>
            </div>
            <div>
              <span className="text-[#767587] block text-[10px]">O'rtacha GPA:</span>
              <span className="font-extrabold text-[#4244df] text-sm">{user.gpa} / 5.0</span>
            </div>
            <div>
              <span className="text-[#767587] block text-[10px]">Davomat darajasi:</span>
              <span className="font-bold text-[#1a1a2b] text-sm">{user.attendanceRate}% (A'lo)</span>
            </div>
          </div>

          {/* Table of Subjects */}
          <div className="border border-[#e3e0f8] rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#efecff] text-[#454555] font-bold text-[11px] border-b border-[#e3e0f8]">
                  <th className="p-2.5">Fan nomi</th>
                  <th className="p-2.5">O'qituvchi</th>
                  <th className="p-2.5 text-center">BSB-1</th>
                  <th className="p-2.5 text-center">Kundalik</th>
                  <th className="p-2.5 text-center">Chorak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e0f8]">
                {SUBJECTS_JOURNAL.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f5f2ff]/50">
                    <td className="p-2.5 font-bold text-[#1a1a2b]">{sub.name}</td>
                    <td className="p-2.5 text-[#767587]">{sub.teacher}</td>
                    <td className="p-2.5 text-center font-semibold text-[#4244df]">{sub.bsbScore}/100</td>
                    <td className="p-2.5 text-center text-[#454555]">
                      {sub.recentGrades.join(', ')}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        sub.warning ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#e1e0ff] text-[#4244df]'
                      }`}>
                        {sub.quarterGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Teacher Recommendation & Stamp */}
          <div className="p-3 bg-[#f5f2ff] rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[#1a1a2b] block">Sinf rahbari xulosasi:</span>
              <p className="text-[#454555] text-[11px]">
                Akademik o'zlashtirish juda yaxshi. Biologiya fanidan qoldirilgan laboratoriya darsini tiklash tavsiya etiladi.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#767587] block">Elektron tasdiq:</span>
              <span className="font-bold text-[#4244df] text-[11px]">E-Imzo Tasdiqlangan ✓</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#efecff] border-t border-[#e3e0f8] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#454555] hover:bg-white"
          >
            Yopish
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#4244df] hover:bg-[#5d61f9] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Chop etish / PDF Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
