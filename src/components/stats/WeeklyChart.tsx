'use client';

import { useTimerStore } from '@/store/timer-store';
import { formatTime } from '@/components/timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export function WeeklyChart() {
  const sessions = useTimerStore((state) => state.sessions);
  
  // Generate last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = sessions.filter(s => s.date === dateStr);
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    
    return {
      date: dateStr,
      day: format(date, 'EEE'),
      minutes: totalMinutes,
      sessions: daySessions.length,
    };
  });
  
  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1);
  
  return (
    <Card className="bg-card/50 border-border/50 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">This Week</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'oklch(0.6 0.02 240)' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 240)' }}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                contentStyle={{
                  background: 'oklch(0.18 0.01 240)',
                  border: '1px solid oklch(0.25 0.015 240)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'oklch(0.95 0.005 180)' }}
                formatter={(value: number) => [`${value} minutes`, 'Focus Time']}
              />
              <Bar 
                dataKey="minutes" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {last7Days.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.minutes > 0 
                      ? 'oklch(0.7 0.16 180)' 
                      : 'oklch(0.25 0.015 240)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Week summary */}
        <div className="mt-4 pt-3 border-t border-border/50 flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Week Total: </span>
            <span className="font-medium">
              {formatTime(last7Days.reduce((acc, d) => acc + d.minutes * 60, 0), false)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Sessions: </span>
            <span className="font-medium">
              {last7Days.reduce((acc, d) => acc + d.sessions, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
