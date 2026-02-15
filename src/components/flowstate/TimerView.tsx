'use client'

import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react'
import { useFlowStateStore } from '@/store/flowstate'
import { Play, Pause, RotateCcw, Check, Zap, TrendingUp } from 'lucide-react'
import { subDays } from 'date-fns'

// Helper to check if we're on the client
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

function AchievementBar() {
  const { sessions } = useFlowStateStore()
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
  
  if (!mounted || sessions.length === 0) return null
  
  // Calculate today's total
  const today = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter(s => s.date === today)
  const todayTotal = todaySessions.reduce((acc, s) => acc + s.duration, 0)
  
  // Calculate 7-day average (excluding today)
  const weekAgo = subDays(new Date(), 7)
  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= weekAgo && s.date !== today
  })
  const daysWithSessions = [...new Set(weekSessions.map(s => s.date))].length
  const dailyAverage = daysWithSessions > 0 ? weekSessions.reduce((acc, s) => acc + s.duration, 0) / daysWithSessions : 0
  
  // Calculate improvement vs average
  const improvementPercent = dailyAverage > 0 
    ? Math.round(((todayTotal - dailyAverage) / dailyAverage) * 100) 
    : 0
  
  const formatTime = (seconds: number) => {
    const mins = Math.round(seconds / 60)
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60)
      const remainMins = mins % 60
      return `${hrs}h ${remainMins}m`
    }
    return `${mins}m`
  }
  
  // Only show if there's data
  if (todayTotal === 0 && dailyAverage === 0) return null
  
  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-3 mb-6 max-w-xs mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg. focus</p>
            <p className="text-sm font-semibold">{formatTime(dailyAverage || todayTotal)}/day</p>
          </div>
        </div>
        
        {improvementPercent !== 0 && todayTotal > 0 && (
          <div className={`text-right ${improvementPercent > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
            <p className="text-xs">Today</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              {improvementPercent > 0 ? '+' : ''}{improvementPercent}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function TimerView() {
  const { 
    isRunning, 
    elapsedSeconds, 
    minTimeReached,
    settings,
    startTimer, 
    pauseTimer, 
    resetTimer, 
    tick,
    saveSession
  } = useFlowStateStore()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, tick])
  
  const handleStart = useCallback(() => {
    startTimer()
  }, [startTimer])
  
  const handlePause = useCallback(() => {
    pauseTimer()
  }, [pauseTimer])
  
  const handleReset = useCallback(() => {
    if (elapsedSeconds >= 60) {
      saveSession()
    }
    resetTimer()
  }, [elapsedSeconds, saveSession, resetTimer])
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const minTimeSeconds = settings.minFocusTime * 60
  const progress = Math.min((elapsedSeconds / minTimeSeconds) * 100, 100)
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Achievement Bar */}
      <AchievementBar />
      
      {/* Status indicator */}
      <div className="mb-8 text-center">
        {minTimeReached ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Goal reached! Keep going!</span>
          </div>
        ) : isRunning ? (
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Stay focused...</span>
          </div>
        ) : elapsedSeconds > 0 ? (
          <span className="text-sm text-muted-foreground">Paused</span>
        ) : (
          <span className="text-sm text-muted-foreground">Ready to focus</span>
        )}
      </div>
      
      {/* Progress ring */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums text-foreground">
            {formatTime(elapsedSeconds)}
          </span>
          {!minTimeReached && isRunning && (
            <span className="text-sm text-muted-foreground mt-2">
              {settings.minFocusTime} min goal
            </span>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Pause className="w-7 h-7" fill="currentColor" />
          </button>
        )}
        
        {elapsedSeconds > 0 && (
          <button
            onClick={handleReset}
            className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center shadow hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Helpful hint */}
      <p className="mt-8 text-center text-sm text-muted-foreground max-w-xs">
        {isRunning 
          ? "Focus on your task. You can stop anytime after reaching your goal."
          : "Tap play to start your focus session. The timer counts UP, so you can continue as long as you want!"
        }
      </p>
    </div>
  )
}
