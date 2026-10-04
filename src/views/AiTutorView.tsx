import React, { useState } from 'react';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { ChatMessage, Language } from '../types';
import { playSuccessChime, playClickSound } from '../utils/sound';

interface AiTutorViewProps {
  language: Language;
  initialQuery?: string;
  onEarnXp?: (amount: number) => void;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  language,
  initialQuery,
  onEarnXp
}) => {
  const [mode, setMode] = useState<'ai' | 'teacher'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputVal, setInputVal] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);
  const [likedMessage, setLikedMessage] = useState(false);

  // Interactive Mini-Graph controls
  const [frequencyRatio, setFrequencyRatio] = useState(1.4); // f / f0
  const [beamIntensity, setBeamIntensity] = useState(80); // %

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;
    playClickSound();

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      playSuccessChime();
      if (onEarnXp) onEarnXp(5);

      let replyTitle = 'Key Physics Insight';
      let points = [
        'Har bir foton o\'zining aniq kvantlangan energiyasiga ega: E = hf.',
        'Agar tushayotgan nurning chastotasi chegaraviy qiymatdan (f₀) kichik bo\'lsa, nurlanish qanchalik kuchli bo\'lmasin, elektronlar ajralmaydi!'
      ];

      if (text.includes('analog') || text.includes('oddiy')) {
        replyTitle = 'Oddiy Hayotiy O\'xshatish (Analogy)';
        points = [
          'Tasavvur qiling, qalin devordan o\'tish uchun sakrash balandligi kamida 2 metr (f₀) bo\'lishi kerak.',
          'Qizil nur — bu 50 sm ga sakraydigan odamlar. Ulardan 10,000 tasini to\'plasangiz ham, hech kim devordan osha olmaydi. Moviy foton esa birdaniga 2.5 metrga sakraydi va devordan darhol oshib o\'tadi!'
        ];
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: mode === 'ai' ? 'ai' : 'teacher',
        text: '',
        timestamp: 'Just now',
        takeawayTitle: replyTitle,
        takeawayPoints: points
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  const handleForwardToTeacher = () => {
    playSuccessChime();
    setIsForwarded(true);
  };

  const handleReadAloud = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4 px-4 sm:px-6 max-w-4xl mx-auto pt-2">
      {/* Mode Selector Toggle */}
      <div className="bg-[#e8e6fe] p-1 rounded-full flex items-center shadow-xs border border-[#c6c4d8]/40">
        <button
          onClick={() => {
            playClickSound();
            setMode('ai');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all ${
            mode === 'ai'
              ? 'bg-[#4244df] text-white shadow-xs'
              : 'text-[#454555] hover:text-[#1a1a2b]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>AI Repetitor</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setMode('teacher');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all ${
            mode === 'teacher'
              ? 'bg-[#4244df] text-white shadow-xs'
              : 'text-[#454555] hover:text-[#1a1a2b]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="leading-tight">Ask Teacher</span>
            <span className="opacity-75 text-[9px] leading-tight font-normal">Mrs. Shavkatova</span>
          </div>
        </button>
      </div>

      {/* Curriculum Context Banner */}
      <div className="bg-[#f5f2ff] rounded-2xl p-3 flex items-center justify-between shadow-xs border border-[#e8e6fe]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#e1e0ff] flex items-center justify-center text-[#4244df] shrink-0">
            <span className="material-symbols-outlined text-[20px]">science</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#4244df] uppercase tracking-wider font-bold font-display">
              Curriculum Context
            </span>
            <span className="text-xs font-bold text-[#1a1a2b] truncate font-display">
              Physics • Photoelectric Effect &amp; Photons
            </span>
          </div>
        </div>
        <span className="text-[11px] bg-[#fbd8f9] text-[#29132c] px-2.5 py-1 rounded-full shrink-0 font-bold flex items-center gap-1 font-display">
          <span className="material-symbols-outlined text-[13px]">lock</span> Ch. 4.2
        </span>
      </div>

      {/* Timeline Timestamp */}
      <div className="flex items-center justify-center my-0.5">
        <span className="text-[11px] text-[#767587] bg-[#efecff] px-3 py-0.5 rounded-full font-semibold">
          Today, 10:14 AM
        </span>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai' || msg.sender === 'teacher';

          if (isAi) {
            return (
              <div key={msg.id} className="flex flex-col items-start max-w-[95%] space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4244df] flex items-center justify-center text-white shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">
                      {msg.sender === 'ai' ? 'smart_toy' : 'support_agent'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#454555]">
                    {msg.sender === 'ai' ? 'IlmBot Physics AI' : 'Mrs. Shavkatova (Teacher)'}
                  </span>
                  <span className="text-[10px] bg-[#e1e0ff] text-[#4244df] px-1.5 py-0.2 rounded font-semibold">
                    {msg.sender === 'ai' ? 'Tutor' : 'Mentor'}
                  </span>
                </div>

                <div className="bg-white rounded-3xl rounded-tl-sm p-4 shadow-sm space-y-3 border border-[#e8e6fe] w-full">
                  {msg.text && (
                    <p className="text-xs text-[#1a1a2b] leading-relaxed">
                      {msg.text}
                    </p>
                  )}

                  {/* Initial interactive exploration triggers if hasGraph */}
                  {msg.hasGraph && (
                    <>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => handleSendMessage('Formula: E = hf haqida batafsil')}
                          className="bg-[#efecff] text-[#4244df] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#e1e0ff] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">functions</span>
                          <span>Formula: E = hf</span>
                        </button>
                        <button
                          onClick={() => handleSendMessage('Intensity vs Stopping Potential tahlili')}
                          className="bg-[#efecff] text-[#4244df] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#e1e0ff] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">show_chart</span>
                          <span>Intensity vs Stopping Potential</span>
                        </button>
                      </div>

                      {/* Interactive Concept Mini-Graph */}
                      <div className="bg-[#f5f2ff] rounded-2xl p-3 flex flex-col space-y-2 border border-[#e8e6fe]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#454555]">Concept Mini-Graph</span>
                          <span className="text-[11px] text-[#4244df] font-bold">Interactive Sandbox</span>
                        </div>

                        {/* Interactive Sliders */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#454555] bg-white p-2 rounded-xl border border-[#e8e6fe]">
                          <div>
                            <div className="flex justify-between font-bold">
                              <span>Frequency (f/f₀):</span>
                              <span className="text-[#4244df]">{frequencyRatio.toFixed(1)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.5"
                              step="0.1"
                              value={frequencyRatio}
                              onChange={(e) => setFrequencyRatio(parseFloat(e.target.value))}
                              className="w-full accent-[#4244df] cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between font-bold">
                              <span>Beam Intensity:</span>
                              <span className="text-[#4454bb]">{beamIntensity}%</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              step="5"
                              value={beamIntensity}
                              onChange={(e) => setBeamIntensity(parseInt(e.target.value))}
                              className="w-full accent-[#4454bb] cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Dynamic SVG graph responding to sliders */}
                        <div className="w-full h-24 bg-white rounded-xl p-2 flex items-end justify-between relative overflow-hidden border border-[#e8e6fe]">
                          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 240 80">
                            <line className="text-[#e3e0f8]" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="240" y1="20" y2="20" />
                            <line className="text-[#e3e0f8]" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="240" y1="50" y2="50" />
                            <line className="text-[#767587]" stroke="currentColor" strokeWidth="1.5" x1="20" x2="20" y1="5" y2="70" />
                            <line className="text-[#767587]" stroke="currentColor" strokeWidth="1.5" x1="20" x2="230" y1="70" y2="70" />

                            {/* Dynamic Photoelectric curve */}
                            {frequencyRatio >= 1.0 ? (
                              <path
                                d={`M 20 70 Q ${40 + (frequencyRatio - 1) * 30} 65, 80 ${70 - (frequencyRatio - 0.8) * 20} T 220 ${70 - (beamIntensity / 100) * 45}`}
                                fill="none"
                                stroke="#4244df"
                                strokeWidth="2.5"
                              />
                            ) : (
                              <line x1="20" y1="70" x2="220" y2="70" stroke="#ba1a1a" strokeWidth="2" strokeDasharray="3 3" />
                            )}

                            {/* Threshold marker */}
                            <circle cx="20" cy="70" r="3.5" fill={frequencyRatio >= 1.0 ? '#4244df' : '#ba1a1a'} />
                            <text x="24" y="66" className="text-[9px] fill-[#454555] font-sans font-bold">
                              {frequencyRatio >= 1.0 ? `-V₀ (${(frequencyRatio * 1.8).toFixed(1)}V)` : 'f < f₀ (No Current)'}
                            </text>
                          </svg>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Takeaway points */}
                  {msg.takeawayTitle && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[#4244df] font-bold text-xs">
                        <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                        <span>{msg.takeawayTitle}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.takeawayPoints?.map((p, i) => (
                          <div key={i} className="bg-[#f5f2ff] p-2.5 rounded-xl border border-[#e8e6fe]">
                            <p className="text-xs text-[#1a1a2b] leading-relaxed">{p}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reactions & audio read aloud */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              playClickSound();
                              setLikedMessage(!likedMessage);
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                              likedMessage ? 'bg-[#4244df] text-white' : 'bg-[#efecff] text-[#454555] hover:bg-[#e1e0ff]'
                            }`}
                          >
                            <span>Helpful</span>
                            <span>👍</span>
                          </button>
                          <button
                            onClick={() => handleSendMessage('Mavzuni yanada soddaroq hayotiy misol bilan tushuntirib bera olasizmi?')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#efecff] hover:bg-[#e1e0ff] text-[#454555] text-xs font-semibold transition-all"
                          >
                            <span>Need simpler analogy</span>
                            <span>💡</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleReadAloud(msg.takeawayPoints?.join(' ') || '')}
                          title="Ovozli o'qish"
                          className="text-[#767587] hover:text-[#4244df] p-1"
                        >
                          <span className="material-symbols-outlined text-[18px]">volume_up</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Student bubble
          return (
            <div key={msg.id} className="flex flex-col items-end self-end max-w-[85%] space-y-1 animate-in fade-in duration-200">
              <div className="bg-[#4244df] text-white rounded-3xl rounded-tr-sm p-3.5 shadow-sm">
                <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 text-[#767587] text-[10px] pr-1">
                <span>Delivered</span>
                <span className="material-symbols-outlined text-[13px] text-[#4244df]">done_all</span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#767587] bg-white p-3 rounded-2xl w-36 shadow-xs border border-[#e8e6fe]">
            <span className="w-2 h-2 rounded-full bg-[#4244df] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#4244df] animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-[#4244df] animate-bounce delay-200" />
            <span className="text-[11px] font-semibold">Yozmoqda...</span>
          </div>
        )}
      </div>

      {/* Teacher Escalation Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f5f2ff] via-[#efecff] to-[#e8e6fe] p-4 shadow-sm border border-[#e8e6fe]">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              alt="Teacher Mrs. Shavkatova"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH-QkvYVVENXF_GUJfNKcaeK-TKY8BdAmPSyi1b7X9YPwko0479pSDSXUfTXR4y_V9urwqWED-hxdr2pKnLTKTConm-wGrlm1ld4g2A8c7v7ylawemJl905ccCTmnlNWYzoV0qfCBgU7Bcv0tJbA9vbO7FqUP8X1__deOmt6-vSvxqXawr2318SmKqlMznouxNYu-YZwihnEQdXlgK-byXWtNuQaW2BWW7DdMSVDpo8mVtigYNAB0-"
              className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-[#1a1a2b] font-display">
                Still confused on threshold?
              </h4>
              <span className="text-[10px] text-[#4244df] font-bold bg-[#e1e0ff] px-2 py-0.5 rounded-full">
                Available
              </span>
            </div>
            <p className="text-xs text-[#454555] mt-0.5">
              Mrs. Shavkatova can review this exact thread during office hours or leave a tailored voice note.
            </p>

            <button
              onClick={handleForwardToTeacher}
              className={`mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                isForwarded
                  ? 'bg-[#e1e0ff] text-[#05006c]'
                  : 'bg-white hover:bg-[#4244df] hover:text-white text-[#4244df]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isForwarded ? 'check_circle' : 'send_to_mobile'}
              </span>
              <span>
                {isForwarded ? 'Forwarded to Mrs. Shavkatova ✓' : 'Forward Question to Mrs. Shavkatova (1-Tap)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Chat Input Dock */}
      <div className="sticky bottom-2 pt-2 bg-transparent">
        <div className="bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_8px_30px_rgba(66,68,223,0.12)] flex items-center gap-2 border border-[#e8e6fe]">
          <button
            onClick={() => alert('Formula yoki darslik sahifasini biriktirish oynasi')}
            aria-label="Attach equation or image"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#767587] hover:text-[#4244df] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask physics question or request formula..."
            className="flex-1 min-w-0 bg-transparent text-[#1a1a2b] placeholder:text-[#767587] text-xs outline-none px-1"
          />

          <button
            onClick={() => setIsRecording(!isRecording)}
            aria-label="Record voice question"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isRecording ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse' : 'text-[#767587] hover:text-[#4244df]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>

          <button
            onClick={() => handleSendMessage()}
            aria-label="Send query"
            className="w-10 h-10 rounded-full bg-[#4244df] hover:bg-[#5d61f9] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
