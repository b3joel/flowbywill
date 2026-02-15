'use client';

import { useEffect, useRef } from 'react';

interface TimerRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  goalReached?: boolean;
  isRunning?: boolean;
}

export function TimerRing({ 
  progress, 
  size = 280, 
  strokeWidth = 12,
  goalReached = false,
  isRunning = false
}: TimerRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - normalizedProgress);
  
  const glowRef = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    if (goalReached && glowRef.current) {
      glowRef.current.classList.add('animate-pulse-glow');
    } else if (glowRef.current) {
      glowRef.current.classList.remove('animate-pulse-glow');
    }
  }, [goalReached]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="timer-ring-bg"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="timer-ring-progress"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            stroke: goalReached 
              ? 'oklch(0.7 0.16 180)' 
              : isRunning 
                ? 'oklch(0.6 0.14 180)' 
                : 'oklch(0.5 0.1 180)',
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
          }}
          ref={glowRef}
        />
        
        {/* Glow effect when goal reached */}
        {goalReached && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              stroke: 'oklch(0.7 0.16 180 / 0.3)',
              filter: 'blur(8px)',
            }}
          />
        )}
      </svg>
      
      {/* Center content area */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: strokeWidth + 20 }}
      >
        <div className="text-center">
          {/* Glow animation container */}
          <div className={goalReached ? 'timer-ring-glow' : ''}>
            <div className={`transition-all duration-500 ${goalReached ? 'scale-105' : ''}`}>
              {/* Content will be rendered by parent */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
