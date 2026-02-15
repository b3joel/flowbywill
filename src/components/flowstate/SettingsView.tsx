'use client'

import { useFlowStateStore } from '@/store/flowstate'
import { Volume2, Vibrate, Timer, Bell, Crown, ChevronRight } from 'lucide-react'

export function SettingsView() {
  const { settings, updateSettings, isPremium, setPremium } = useFlowStateStore()
  
  const timeOptions = [5, 10, 15, 20, 25, 30, 45, 60]
  
  return (
    <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
      {/* Premium Banner */}
      {!isPremium && (
        <button 
          onClick={() => setPremium(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white text-left hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Go Premium</h3>
              <p className="text-sm opacity-90">Unlock all features & support development</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </div>
        </button>
      )}
      
      {/* Timer Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Timer Settings</h2>
        
        {/* Minimum Focus Time */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Timer className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="font-medium">Minimum Focus Time</p>
              <p className="text-sm text-muted-foreground">Your daily goal</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => updateSettings({ minFocusTime: time })}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.minFocusTime === time
                    ? 'bg-teal-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {time}m
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        
        {/* Sound */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-muted-foreground">Play sounds for events</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.soundEnabled ? 'bg-teal-500' : 'bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
              settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        {/* Vibration */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Vibrate className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium">Vibration</p>
              <p className="text-sm text-muted-foreground">Haptic feedback</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.vibrationEnabled ? 'bg-teal-500' : 'bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
              settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        {/* Break Reminder */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium">Break Reminder</p>
              <p className="text-sm text-muted-foreground">Remind to take breaks</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[0, 30, 45, 60].map((time) => (
              <button
                key={time}
                onClick={() => updateSettings({ breakReminder: time })}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.breakReminder === time
                    ? 'bg-teal-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {time === 0 ? 'Off' : `${time}m`}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>FlowState v1.0.0</p>
        <p className="mt-1">Built with ❤️ for focus</p>
      </div>
    </div>
  )
}
