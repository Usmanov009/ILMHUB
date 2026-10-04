import React, { useState } from 'react';
import { INITIAL_USER } from './data/mockData';
import { TabType, Language, UserProfile } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { RecoveryModal } from './components/RecoveryModal';
import { PhysicsDuelModal } from './components/PhysicsDuelModal';
import { ReportCardModal } from './components/ReportCardModal';
import { HomeworkModal } from './components/HomeworkModal';
import { TranscriptModal } from './components/TranscriptModal';

import { DashboardView } from './views/DashboardView';
import { ScheduleView } from './views/ScheduleView';
import { LessonView } from './views/LessonView';
import { RecoveryView } from './views/RecoveryView';
import { AiTutorView } from './views/AiTutorView';
import { GrowthView } from './views/GrowthView';
import { ProfileView } from './views/ProfileView';
import { playSuccessChime } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [language, setLanguage] = useState<Language>('uz');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [hasActiveCatchup, setHasActiveCatchup] = useState(true);

  // Modals
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [homeworkType, setHomeworkType] = useState<'physics_test' | 'algebra_photo' | null>(null);

  // AI prefilled prompt
  const [aiPrompt, setAiPrompt] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'xp'>('success');

  const triggerToast = (msg: string, type: 'success' | 'info' | 'xp' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  const handleEarnXp = (amount: number, reason?: string) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount
    }));
    triggerToast(`+${amount} XP earned! ${reason || ''}`, 'xp');
  };

  const handleCompleteRecovery = () => {
    setIsRecoveryOpen(false);
    setHasActiveCatchup(false);
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 45,
      attendanceRate: 100
    }));
    playSuccessChime();
    triggerToast(
      language === 'uz'
        ? "Biologiya darsi muvaffaqiyatli tiklandi! Davomat 100% ga yetdi (+45 XP)!"
        : "Урок биологии успешно восстановлен! Посещаемость 100% (+45 XP)!",
      'success'
    );
  };

  const handleHomeworkComplete = (taskName: string, xpEarned: number) => {
    setHomeworkType(null);
    handleEarnXp(xpEarned, `${taskName} topshirildi!`);
  };

  const handleAskAi = (promptText: string) => {
    setAiPrompt(promptText);
    setActiveTab('aitutor');
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1a1a2b] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        user={user}
        language={language}
        onLanguageChange={(l) => setLanguage(l)}
        onOpenProfile={() => setActiveTab('profile')}
        unreadCount={hasActiveCatchup ? 2 : 1}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full pt-16 md:pt-28 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            language={language}
            onLanguageChange={(l) => setLanguage(l)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenRecovery={() => setIsRecoveryOpen(true)}
            hasActiveCatchup={hasActiveCatchup}
            onAskAiTopic={(topic) => handleAskAi(topic)}
            onEarnXp={(amt, reason) => handleEarnXp(amt, reason)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            language={language}
            onOpenRecovery={() => setIsRecoveryOpen(true)}
            onOpenHomeworkModal={(type) => setHomeworkType(type)}
            onAskTeacher={(teacher) => handleAskAi(`${teacher}ga savol: `)}
            hasActiveCatchup={hasActiveCatchup}
          />
        )}

        {activeTab === 'lesson' && (
          <LessonView
            language={language}
            onOpenRecovery={() => setIsRecoveryOpen(true)}
            onOpenTranscript={() => setIsTranscriptOpen(true)}
            onAskAi={(prompt) => handleAskAi(prompt)}
            onEarnXp={(amt) => handleEarnXp(amt)}
            hasActiveCatchup={hasActiveCatchup}
          />
        )}

        {activeTab === 'recovery' && (
          <RecoveryView
            language={language}
            onOpenRecoveryModal={() => setIsRecoveryOpen(true)}
            onAskAi={(prompt) => handleAskAi(prompt)}
            hasActiveCatchup={hasActiveCatchup}
          />
        )}

        {activeTab === 'aitutor' && (
          <AiTutorView
            language={language}
            initialQuery={aiPrompt}
            onEarnXp={(amt) => handleEarnXp(amt)}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthView
            user={user}
            language={language}
            onOpenReportModal={() => setIsReportOpen(true)}
            onOpenDuelArena={() => setIsDuelOpen(true)}
            onOpenRecovery={() => setIsRecoveryOpen(true)}
            hasActiveCatchup={hasActiveCatchup}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            language={language}
            onLanguageChange={(l) => setLanguage(l)}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onTriggerToast={triggerToast}
          />
        )}
      </main>

      {/* Navigation (Bottom dock on mobile, secondary top tabs on desktop) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        language={language}
        hasActiveCatchup={hasActiveCatchup}
      />

      {/* Global Modals */}
      <RecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        onComplete={handleCompleteRecovery}
        language={language}
      />

      <PhysicsDuelModal
        isOpen={isDuelOpen}
        onClose={() => setIsDuelOpen(false)}
        onEarnXp={(amt) => handleEarnXp(amt, "Arenda g'olib bo'ldingiz!")}
        language={language}
      />

      <ReportCardModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        user={user}
        language={language}
      />

      <HomeworkModal
        isOpen={homeworkType !== null}
        type={homeworkType}
        onClose={() => setHomeworkType(null)}
        onComplete={handleHomeworkComplete}
        language={language}
      />

      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        language={language}
      />

      {/* Global Floating Toast Alert */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
      />
    </div>
  );
}
