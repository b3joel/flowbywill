import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  targetTime: number; // minimum target time in seconds
  goalReached: boolean;
  date: string; // ISO date string for grouping
}

export interface TimerState {
  // Timer state
  status: TimerStatus;
  elapsedSeconds: number;
  targetSeconds: number;
  startTime: number | null;
  
  // Presets
  presets: number[]; // in minutes
  
  // Sessions history
  sessions: Session[];
  
  // Settings
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundType: 'chime' | 'bell' | 'gentle' | 'none';
  theme: 'dark' | 'light' | 'system';
  dailyGoalMinutes: number;
  isPremium: boolean;
  selectedTheme: 'default' | 'ocean' | 'forest' | 'sunset';
  
  // Actions
  setTarget: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => boolean;
  
  // Settings actions
  updateSettings: (settings: Partial<TimerState>) => void;
  setPresets: (presets: number[]) => void;
  
  // Session actions
  saveSession: () => void;
  getTodaySessions: () => Session[];
  getWeekSessions: () => Session[];
  getSessionsByDate: (date: string) => Session[];
  clearSessions: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'idle',
      elapsedSeconds: 0,
      targetSeconds: 30 * 60, // 30 minutes default
      startTime: null,
      
      presets: [15, 30, 45, 60],
      
      sessions: [],
      
      notificationsEnabled: true,
      soundEnabled: true,
      soundType: 'chime',
      theme: 'dark',
      dailyGoalMinutes: 120,
      isPremium: false,
      selectedTheme: 'default',
      
      // Timer actions
      setTarget: (minutes: number) => {
        set({ targetSeconds: minutes * 60 });
      },
      
      startTimer: () => {
        const now = Date.now();
        set({
          status: 'running',
          startTime: now,
          elapsedSeconds: 0,
        });
      },
      
      pauseTimer: () => {
        set({ status: 'paused' });
      },
      
      resumeTimer: () => {
        const state = get();
        const adjustedStartTime = Date.now() - (state.elapsedSeconds * 1000);
        set({
          status: 'running',
          startTime: adjustedStartTime,
        });
      },
      
      stopTimer: () => {
        const state = get();
        if (state.elapsedSeconds > 0) {
          // Save session
          const session: Session = {
            id: generateId(),
            startTime: state.startTime || Date.now(),
            endTime: Date.now(),
            duration: state.elapsedSeconds,
            targetTime: state.targetSeconds,
            goalReached: state.elapsedSeconds >= state.targetSeconds,
            date: formatDate(state.startTime || Date.now()),
          };
          
          set({
            status: 'completed',
            sessions: [...state.sessions, session],
          });
        } else {
          set({ status: 'idle' });
        }
      },
      
      resetTimer: () => {
        set({
          status: 'idle',
          elapsedSeconds: 0,
          startTime: null,
        });
      },
      
      tick: () => {
        const state = get();
        if (state.status === 'running' && state.startTime) {
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          set({ elapsedSeconds: elapsed });
          
          // Check if goal just reached
          if (elapsed === state.targetSeconds) {
            // Goal reached - trigger notification
            return true;
          }
        }
        return false;
      },
      
      // Settings actions
      updateSettings: (settings: Partial<TimerState>) => {
        set(settings);
      },
      
      setPresets: (presets: number[]) => {
        set({ presets });
      },
      
      // Session actions
      saveSession: () => {
        const state = get();
        if (state.elapsedSeconds > 0 && state.startTime) {
          const session: Session = {
            id: generateId(),
            startTime: state.startTime,
            endTime: Date.now(),
            duration: state.elapsedSeconds,
            targetTime: state.targetSeconds,
            goalReached: state.elapsedSeconds >= state.targetSeconds,
            date: formatDate(state.startTime),
          };
          
          set({
            sessions: [...state.sessions, session],
            status: 'idle',
            elapsedSeconds: 0,
            startTime: null,
          });
        }
      },
      
      getTodaySessions: () => {
        const state = get();
        const today = formatDate(Date.now());
        return state.sessions.filter(s => s.date === today);
      },
      
      getWeekSessions: () => {
        const state = get();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return state.sessions.filter(s => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= weekAgo && sessionDate <= now;
        });
      },
      
      getSessionsByDate: (date: string) => {
        const state = get();
        return state.sessions.filter(s => s.date === date);
      },
      
      clearSessions: () => {
        set({ sessions: [] });
      },
    }),
    {
      name: 'flowstate-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        notificationsEnabled: state.notificationsEnabled,
        soundEnabled: state.soundEnabled,
        soundType: state.soundType,
        theme: state.theme,
        dailyGoalMinutes: state.dailyGoalMinutes,
        isPremium: state.isPremium,
        selectedTheme: state.selectedTheme,
        presets: state.presets,
      }),
    }
  )
);
