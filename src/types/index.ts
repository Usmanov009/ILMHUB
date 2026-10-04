export type Language = 'uz' | 'ru' | 'en';

export type TabType = 'dashboard' | 'schedule' | 'lesson' | 'recovery' | 'aitutor' | 'growth' | 'profile';

export interface SubjectGrade {
  id: string;
  name: string;
  teacher: string;
  quarterGrade: string; // '5', '4', '3/4'
  gradeLabel: string; // "A'lo", "Yaxshi", "Xavf ostida"
  recentGrades: number[];
  bsbScore: number;
  bsbMax: number;
  taskTitle: string;
  taskStatus: 'done' | 'pending' | 'missed';
  statusColor: string;
  warning?: boolean;
}

export interface TimetableLesson {
  id: string;
  periodNumber: number;
  time: string;
  room: string;
  subject: string;
  teacher: string;
  topic: string;
  status: 'completed' | 'in_progress' | 'missed' | 'upcoming';
  grade?: number;
  gradeLabel?: string;
  xp?: number;
  homeworkSubmitted?: boolean;
  score?: string;
  homeworkTask?: string;
}

export interface DayTimetable {
  dayNum: number;
  dayNameUz: string;
  dayNameRu: string;
  dayNameEn: string;
  dateStrUz: string;
  dateStrRu: string;
  isToday?: boolean;
  lessons: TimetableLesson[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'student' | 'teacher';
  text: string;
  timestamp: string;
  takeawayTitle?: string;
  takeawayPoints?: string[];
  interactiveFormula?: string;
  hasGraph?: boolean;
  isForwarded?: boolean;
}

export interface MitosisStage {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  keyFeature: string;
}

export interface CatchUpModule {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  teacherNote: string;
  durationMin: number;
  xpReward: number;
  priority: string;
  missedDate: string;
  isCompleted: boolean;
  stages: MitosisStage[];
  fastTrackProgress: {
    digestDone: boolean;
    videoProgress: number; // 0 - 100
    quizCompleted: boolean;
  };
}

export interface UserProfile {
  name: string;
  grade: string;
  schoolYear: string;
  avatarUrl: string;
  xp: number;
  streakDays: number;
  level: number;
  levelTitle: string;
  gpa: number;
  attendanceRate: number;
  rankInCohort: number;
  cohortTotal: number;
  cohortName: string;
}
