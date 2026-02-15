'use client'

import { useState, useSyncExternalStore } from 'react'
import { TimerView } from '@/components/flowstate/TimerView'
import { SettingsView } from '@/components/flowstate/SettingsView'
import { Timer, Settings } from 'lucide-react'

type Tab = 'timer' | 'settings'

// Helper to check if we're on the client
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('timer')
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg">FlowState</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="pb-20">
        {!mounted ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === 'timer' && <TimerView />}
            {activeTab === 'settings' && <SettingsView />}
          </>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              activeTab === 'timer' 
                ? 'text-teal-600 dark:text-teal-400' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Timer className="w-6 h-6" />
            <span className="text-xs mt-1">Focus</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              activeTab === 'settings' 
                ? 'text-teal-600 dark:text-teal-400' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </main>
  )
}
