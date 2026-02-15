'use client';

import { useEffect, useState } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarViewProps {
  selectedMonth?: Date;
}

export function CalendarView({ selectedMonth }: CalendarViewProps) {
  const sessions = useTimerStore((state) => state.sessions);
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  useEffect(() => {
    setMounted(true);
    if (selectedMonth) setCurrentMonth(selectedMonth);
  }, [selectedMonth]);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();
  const calendarDays = [...Array(startDay).fill(null), ...days];
  
  const getSessionsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.filter(s => s.date === dateStr);
  };
  
  const getIntensity = (daySessions: ReturnType<typeof getSessionsForDay>) => {
    if (daySessions.length === 0) return 0;
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    if (totalMinutes < 30) return 1;
    if (totalMinutes < 60) return 2;
    if (totalMinutes < 120) return 3;
    return 4;
  };
  
  const intensityColors = [
    'oklch(0.22 0.015 240)',
    'oklch(0.35 0.08 180)',
    'oklch(0.5 0.12 180)',
    'oklch(0.65 0.14 180)',
    'oklch(0.75 0.16 180)',
  ];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (!mounted) {
    return (
      <Card className="bg-card/50 border-border/50 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full flex items-center justify-center text-muted-foreground">Loading calendar...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="aspect-square" />;
            const daySessions = getSessionsForDay(day);
            const intensity = getIntensity(daySessions);
            const hasActivity = daySessions.length > 0;
            return (
              <div key={day.toISOString()} className="aspect-square rounded-md flex items-center justify-center text-xs transition-all duration-200"
                style={{ background: intensityColors[intensity], color: hasActivity ? 'oklch(0.95 0.005 180)' : 'oklch(0.6 0.02 240)' }}
                title={hasActivity ? `${daySessions.length} session(s), ${Math.round(daySessions.reduce((a, s) => a + s.duration, 0) / 60)}min` : ''}>
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Less</span>
          {intensityColors.map((color, i) => (<div key={i} className="w-3 h-3 rounded-sm" style={{ background: color }} />))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
