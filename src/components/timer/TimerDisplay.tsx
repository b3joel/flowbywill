'use client';

import { useEffect } from 'react';

interface TimerDisplayProps {
  seconds: number;
  targetSeconds: number;
  goalReached: boolean;
  size?: 'normal' | 'large';
}

export function formatTime(totalSeconds: number, showSeconds = true): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    if (showSeconds) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours}h ${minutes}m`;
  }
  
  if (showSeconds) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes} min`;
}

export function TimerDisplay({ 
  seconds, 
  targetSeconds, 
  goalReached,
  size = 'large'
}: TimerDisplayProps) {
  const fontSize = size === 'large' ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl';
  
  // Calculate percentage of goal
  const progress = targetSeconds > 0 ? seconds / targetSeconds : 0;
  
  return (
    <div className="text-center space-y-2">
      {/* Main time display */}
      <div 
        className={`font-mono font-bold tracking-tight transition-all duration-500 ${fontSize}`}
        style={{
          color: goalReached 
            ? 'oklch(0.8 0.14 180)' 
            : 'oklch(0.95 0.01 180)',
          textShadow: goalReached 
            ? '0 0 30px oklch(0.7 0.16 180 / 0.5)' 
            : 'none',
        }}
      >
        {formatTime(seconds)}
      </div>
      
      {/* Target indicator */}
      {!goalReached && seconds > 0 && (
        <div className="text-sm text-muted-foreground opacity-70">
          Goal: {formatTime(targetSeconds, false)}
        </div>
      )}
      
      {/* Goal reached message */}
      {goalReached && (
        <div className="animate-fade-in-up">
          <div 
            className="text-sm font-medium px-3 py-1 rounded-full inline-block"
            style={{
              background: 'oklch(0.7 0.16 180 / 0.2)',
              color: 'oklch(0.85 0.12 180)',
            }}
          >
            Goal reached! Keep going
          </div>
        </div>
      )}
      
      {/* Progress percentage for motivation */}
      {!goalReached && seconds > 0 && progress > 0 && (
        <div className="text-xs text-muted-foreground opacity-50">
          {Math.round(progress * 100)}% of goal
        </div>
      )}
    </div>
  );
}
