'use client';

import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Idle state - Start button */}
      {status === 'idle' && (
        <button
          onClick={onStart}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-primary to-primary/80",
            "text-primary-foreground shadow-lg",
            "hover:scale-105 active:scale-95 transition-transform duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          style={{
            boxShadow: '0 4px 20px oklch(0.7 0.16 180 / 0.4)',
          }}
        >
          <Play className="w-8 h-8 ml-1" fill="currentColor" />
        </button>
      )}
      
      {/* Running state - Pause button */}
      {status === 'running' && (
        <div className="flex items-center gap-4">
          <button
            onClick={onPause}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-secondary hover:bg-secondary/80",
              "text-secondary-foreground shadow-md",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          >
            <Pause className="w-6 h-6" fill="currentColor" />
          </button>
          <button
            onClick={onStop}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-destructive/80 hover:bg-destructive",
              "text-white shadow-md",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          >
            <Square className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {/* Paused state - Resume and Stop */}
      {status === 'paused' && (
        <div className="flex items-center gap-4">
          <button
            onClick={onResume}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary to-primary/80",
              "text-primary-foreground shadow-lg",
              "hover:scale-105 active:scale-95 transition-transform duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
            style={{
              boxShadow: '0 4px 15px oklch(0.7 0.16 180 / 0.3)',
            }}
          >
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
          </button>
          <button
            onClick={onStop}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-secondary hover:bg-secondary/80",
              "text-secondary-foreground shadow-md",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          >
            <Square className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {/* Completed state - Reset button */}
      {status === 'completed' && (
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary to-primary/80",
              "text-primary-foreground shadow-lg",
              "hover:scale-105 active:scale-95 transition-transform duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
