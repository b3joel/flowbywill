'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { TimerRing } from './TimerRing';
import { TimerDisplay, formatTime } from './TimerDisplay';
import { TimePresets } from './TimePresets';
import { TimerControls } from './TimerControls';
import { ConfettiCelebration } from './ConfettiCelebration';

// Audio context for notification sounds
const createNotificationSound = (type: 'chime' | 'bell' | 'gentle') => {
  if (typeof window === 'undefined') return null;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case 'chime':
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
      
    case 'bell':
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      break;
      
    case 'gentle':
      oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.2); // C5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      break;
  }
  
  return audioContext;
};

export function Timer() {
  const {
    status,
    elapsedSeconds,
    targetSeconds,
    presets,
    notificationsEnabled,
    soundEnabled,
    soundType,
    isPremium,
    setTarget,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    tick,
  } = useTimerStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasNotifiedRef = useRef(false);
  
  // Derive goalReached from current state (pure derivation, no side effects)
  const goalReached = elapsedSeconds >= targetSeconds && elapsedSeconds > 0;
  
  // Calculate progress
  const progress = targetSeconds > 0 ? Math.min(elapsedSeconds / targetSeconds, 1) : 0;
  
  // Handle tick
  const handleTick = useCallback(() => {
    tick();
  }, [tick]);
  
  // Start interval when running
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(handleTick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, handleTick]);
  
  // Handle goal reached - use a ref to track previous state to avoid setState in effect
  const prevGoalReachedRef = useRef(false);
  
  // Check for goal transition and trigger celebration
  useEffect(() => {
    // Only trigger when transitioning from not-reached to reached
    if (goalReached && !prevGoalReachedRef.current && status === 'running' && !hasNotifiedRef.current) {
      // Use queueMicrotask to defer setState outside the effect
      queueMicrotask(() => {
        hasNotifiedRef.current = true;
        setShowConfetti(true);
        
        // Play sound notification
        if (soundEnabled && soundType !== 'none') {
          try {
            createNotificationSound(soundType);
          } catch (e) {
            console.log('Audio not supported');
          }
        }
        
        // Show browser notification
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('FlowState', {
            body: 'Goal reached! You can continue or complete your session.',
            icon: '/icon-512x512.png',
            tag: 'flowstate-goal',
            silent: !soundEnabled,
          });
        }
      });
    }
    
    prevGoalReachedRef.current = goalReached;
    
    // Reset notification flag when timer resets
    if (status === 'idle' || status === 'completed') {
      hasNotifiedRef.current = false;
    }
  }, [goalReached, status, soundEnabled, soundType, notificationsEnabled]);
  
  // Request notification permission
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);
  
  // Calculate selected minutes for presets
  const selectedMinutes = Math.round(targetSeconds / 60);
  
  // Handle stop - save session and show summary
  const handleStop = useCallback(() => {
    stopTimer();
  }, [stopTimer]);
  
  // Handle reset
  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto">
      {/* Confetti celebration */}
      <ConfettiCelebration 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Timer ring with display */}
      <div className="relative">
        <TimerRing 
          progress={progress} 
          goalReached={goalReached}
          isRunning={status === 'running'}
        />
        
        {/* Center display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TimerDisplay 
            seconds={elapsedSeconds} 
            targetSeconds={targetSeconds}
            goalReached={goalReached}
          />
        </div>
      </div>
      
      {/* Time presets (only when idle) */}
      {status === 'idle' && (
        <div className="animate-fade-in-up w-full">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Set your minimum focus time
          </p>
          <TimePresets
            presets={presets}
            selectedMinutes={selectedMinutes}
            onSelect={(mins) => setTarget(mins)}
            isPremium={isPremium}
          />
        </div>
      )}
      
      {/* Session summary (when completed) */}
      {status === 'completed' && (
        <div className="text-center space-y-3 animate-fade-in-up">
          <p className="text-lg text-foreground">
            Session completed!
          </p>
          <p className="text-3xl font-bold" style={{ color: 'oklch(0.75 0.14 180)' }}>
            {formatTime(elapsedSeconds, true)}
          </p>
          {elapsedSeconds >= targetSeconds ? (
            <p className="text-sm text-muted-foreground">
              You reached your goal and kept going!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {formatTime(elapsedSeconds, false)} of focused work
            </p>
          )}
        </div>
      )}
      
      {/* Timer controls */}
      <TimerControls
        status={status}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onStop={handleStop}
        onReset={handleReset}
      />
      
      {/* Motivational message */}
      {status === 'running' && !goalReached && elapsedSeconds > 0 && (
        <p className="text-sm text-muted-foreground text-center animate-fade-in-up">
          Stay focused, you&apos;re doing great!
        </p>
      )}
      
      {status === 'running' && goalReached && (
        <p className="text-sm text-center animate-fade-in-up" style={{ color: 'oklch(0.75 0.14 180)' }}>
          Amazing work! Keep your flow going or stop when ready.
        </p>
      )}
    </div>
  );
}
