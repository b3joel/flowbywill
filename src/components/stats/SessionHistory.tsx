'use client';

import { useEffect, useState } from 'react';
import { useTimerStore, Session } from '@/store/timer-store';
import { formatTime } from '@/components/timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface SessionItemProps {
  session: Session;
}

function SessionItem({ session }: SessionItemProps) {
  const startTime = format(new Date(session.startTime), 'h:mm a');
  const endTime = format(new Date(session.endTime), 'h:mm a');
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: session.goalReached ? 'oklch(0.7 0.16 180 / 0.2)' : 'oklch(0.25 0.015 240 / 0.5)' }}>
          {session.goalReached ? (
            <CheckCircle className="w-5 h-5" style={{ color: 'oklch(0.75 0.14 180)' }} />
          ) : (
            <Clock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{formatTime(session.duration, false)}</p>
          <p className="text-xs text-muted-foreground">{startTime} - {endTime}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs" style={{ color: session.goalReached ? 'oklch(0.75 0.14 180)' : 'oklch(0.6 0.02 240)' }}>
          {session.goalReached ? 'Goal met' : 'Partial'}
        </p>
        <p className="text-xs text-muted-foreground">Target: {formatTime(session.targetTime, false)}</p>
      </div>
    </div>
  );
}

export function SessionHistory() {
  const sessions = useTimerStore((state) => state.sessions);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = session.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);
  
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
  };

  if (!mounted) {
    return (<Card className="bg-card/50 border-border/50 w-full"><CardContent className="py-8 text-center"><p className="text-muted-foreground">Loading sessions...</p></CardContent></Card>);
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-card/50 border-border/50 w-full">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No sessions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start your first focus session!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50 w-full">
      <CardHeader className="pb-2"><CardTitle className="text-base font-medium">Session History</CardTitle></CardHeader>
      <CardContent className="pb-2">
        <ScrollArea className="h-64 pr-4">
          {sortedDates.map((date) => (
            <div key={date} className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">{formatDateLabel(date)}</p>
              <div className="space-y-1">
                {groupedSessions[date].sort((a, b) => b.startTime - a.startTime).map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
