import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface FocusSession {
  id: string
  startTime: number
  endTime: number
  duration: number // in seconds
  date: string // YYYY-MM-DD
  completedMinTime: boolean
}

export interface FlowStateSettings {
  minFocusTime: number // minutes
  soundEnabled: boolean
  vibrationEnabled: boolean
  breakReminder: number // minutes (0 = off)
}

interface FlowStateStore {
  // Timer state
  isRunning: boolean
  startTime: number | null
  elapsedSeconds: number
  minTimeReached: boolean
  
  // Sessions
  sessions: FocusSession[]
  
  // Settings
  settings: FlowStateSettings
  
  // Subscription (for future monetization)
  isPremium: boolean
  
  // Timer actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  
  // Session actions
  saveSession: () => void
  getTodaySessions: () => FocusSession[]
  getWeekSessions: () => FocusSession[]
  getTotalFocusTime: (sessions: FocusSession[]) => number
  getSessionsByDate: (date: string) => FocusSession[]
  
  // Settings actions
  updateSettings: (settings: Partial<FlowStateSettings>) => void
  
  // Premium
  setPremium: (value: boolean) => void
}

export const useFlowStateStore = create<FlowStateStore>()(
  persist(
    (set, get) => ({
      // Initial timer state
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      minTimeReached: false,
      
      // Initial sessions
      sessions: [],
      
      // Initial settings
      settings: {
        minFocusTime: 15,
        soundEnabled: true,
        vibrationEnabled: true,
        breakReminder: 0,
      },
      
      // Premium
      isPremium: false,
      
      // Timer actions
      startTimer: () => {
        const now = Date.now()
        set({ 
          isRunning: true, 
          startTime: now,
          minTimeReached: false
        })
      },
      
      pauseTimer: () => {
        set({ isRunning: false })
      },
      
      resetTimer: () => {
        set({ 
          isRunning: false, 
          startTime: null, 
          elapsedSeconds: 0,
          minTimeReached: false
        })
      },
      
      tick: () => {
        const { startTime, settings } = get()
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000)
          const minTimeSeconds = settings.minFocusTime * 60
          set({ 
            elapsedSeconds: elapsed,
            minTimeReached: elapsed >= minTimeSeconds
          })
        }
      },
      
      // Session actions
      saveSession: () => {
        const { startTime, elapsedSeconds, settings, sessions } = get()
        if (startTime && elapsedSeconds >= 60) { // Only save if at least 1 minute
          const session: FocusSession = {
            id: crypto.randomUUID(),
            startTime,
            endTime: Date.now(),
            duration: elapsedSeconds,
            date: new Date().toISOString().split('T')[0],
            completedMinTime: elapsedSeconds >= settings.minFocusTime * 60
          }
          set({ sessions: [session, ...sessions] })
        }
      },
      
      getTodaySessions: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().sessions.filter(s => s.date === today)
      },
      
      getWeekSessions: () => {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return get().sessions.filter(s => new Date(s.date) >= weekAgo)
      },
      
      getTotalFocusTime: (sessions: FocusSession[]) => {
        return sessions.reduce((acc, s) => acc + s.duration, 0)
      },
      
      getSessionsByDate: (date: string) => {
        return get().sessions.filter(s => s.date === date)
      },
      
      // Settings actions
      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } })
      },
      
      // Premium
      setPremium: (value) => {
        set({ isPremium: value })
      }
    }),
    {
      name: 'flowstate-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        settings: state.settings,
        isPremium: state.isPremium
      })
    }
  )
)
