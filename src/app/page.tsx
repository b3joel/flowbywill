'use client';

import { useState, useEffect } from 'react';
import { Timer } from '@/components/timer';
import { TodayStats, WeeklyChart, SessionHistory, CalendarView } from '@/components/stats';
import { SettingsPanel } from '@/components/settings';
import { PremiumPage } from '@/components/premium';
import { useTimerStore } from '@/store/timer-store';
import { 
  Timer as TimerIcon, 
  BarChart3, 
  Settings, 
  Crown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'timer' | 'stats' | 'settings' | 'premium';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('timer');
  const { theme, isPremium } = useTimerStore();
  
  // FlowState - ADHD Focus Timer App
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.log);
    }
  }, []);

  const navItems = [
    { id: 'timer' as View, icon: TimerIcon, label: 'Focus' },
    { id: 'stats' as View, icon: BarChart3, label: 'Stats' },
    { id: 'settings' as View, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'oklch(0.7 0.16 180 / 0.2)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'oklch(0.75 0.14 180)' }} />
            </div>
            <h1 className="text-lg font-bold">FlowState</h1>
          </div>
          
          {!isPremium && (
            <button
              onClick={() => setActiveView('premium')}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              style={{ color: 'oklch(0.7 0.16 180)' }}
            >
              <Crown className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24 overflow-y-auto">
        {activeView === 'timer' && (
          <div className="animate-fade-in-up">
            <Timer />
          </div>
        )}
        
        {activeView === 'stats' && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <TodayStats />
            <WeeklyChart />
            <CalendarView />
            <SessionHistory />
          </div>
        )}
        
        {activeView === 'settings' && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <SettingsPanel />
          </div>
        )}
        
        {activeView === 'premium' && (
          <div className="animate-fade-in-up">
            <PremiumPage />
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-background/90 border-t border-border/30">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-all",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={isActive ? {
                  color: 'oklch(0.75 0.14 180)',
                } : {}}
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isActive && "scale-110"
                  )}
                  style={isActive ? {
                    background: 'oklch(0.7 0.16 180 / 0.15)',
                  } : {}}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Install prompt for PWA */}
      <InstallPrompt />
    </div>
  );
}

function InstallPrompt() {
  // Check if already installed on initial render
  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(display-mode: standalone)').matches;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-50 animate-fade-in-up">
      <div 
        className="rounded-2xl p-4 flex items-center justify-between shadow-lg"
        style={{ 
          background: 'oklch(0.18 0.01 240)',
          border: '1px solid oklch(0.25 0.015 240)',
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.7 0.16 180 / 0.2)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: 'oklch(0.75 0.14 180)' }} />
          </div>
          <div>
            <p className="text-sm font-medium">Install FlowState</p>
            <p className="text-xs text-muted-foreground">Add to home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ 
              background: 'oklch(0.7 0.16 180)',
              color: 'oklch(0.15 0.01 240)',
            }}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
