'use client';

import { cn } from '@/lib/utils';

interface TimePresetsProps {
  presets: number[];
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
  disabled?: boolean;
  isPremium?: boolean;
}

export function TimePresets({ 
  presets, 
  selectedMinutes, 
  onSelect, 
  disabled = false,
  isPremium = false 
}: TimePresetsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {presets.map((minutes) => (
        <button
          key={minutes}
          onClick={() => onSelect(minutes)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300",
            "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedMinutes === minutes
              ? "border-primary bg-primary/20 text-primary shadow-lg"
              : "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
          style={selectedMinutes === minutes ? {
            boxShadow: '0 0 20px oklch(0.7 0.16 180 / 0.3)',
          } : {}}
        >
          {minutes}m
        </button>
      ))}
      
      {/* Custom time button */}
      <button
        onClick={() => {
          const custom = prompt('Enter custom time in minutes:', '25');
          if (custom) {
            const minutes = parseInt(custom, 10);
            if (!isNaN(minutes) && minutes > 0 && minutes <= 240) {
              onSelect(minutes);
            }
          }
        }}
        disabled={disabled || !isPremium}
        className={cn(
          "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300",
          "border-2 border-dashed border-border hover:border-primary/50",
          "text-muted-foreground hover:text-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Custom {!isPremium && <span className="text-xs opacity-60">(Pro)</span>}
      </button>
    </div>
  );
}
