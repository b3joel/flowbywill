'use client';

import { useTimerStore, Session } from '@/store/timer-store';
import { formatTime } from '@/components/timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Clock, TrendingUp, Target } from 'lucide-react';

export function TodayStats() {
  const sessions = useTimerStore((state) => state.getTodaySessions());
  
  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const averageSeconds = sessions.length > 0 ? totalSeconds / sessions.length : 0;
  const goalsReached = sessions.filter(s => s.goalReached).length;
  
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{sessions.length}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Time</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(totalSeconds, false)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Average</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(Math.round(averageSeconds), false)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Goals Met</span>
          </div>
          <p className="text-2xl font-bold">{goalsReached}/{sessions.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
