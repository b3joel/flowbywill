'use client';

import { useTimerStore } from '@/store/timer-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Bell, 
  Volume2, 
  Moon, 
  Sun, 
  Target, 
  Crown,
  Trash2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SOUND_OPTIONS = [
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'none', label: 'None' },
] as const;

const THEME_OPTIONS = [
  { value: 'default', label: 'Teal', color: 'oklch(0.7 0.16 180)' },
  { value: 'ocean', label: 'Ocean', color: 'oklch(0.65 0.18 220)' },
  { value: 'forest', label: 'Forest', color: 'oklch(0.65 0.14 150)' },
  { value: 'sunset', label: 'Sunset', color: 'oklch(0.7 0.14 30)' },
] as const;

export function SettingsPanel() {
  const {
    notificationsEnabled,
    soundEnabled,
    soundType,
    theme,
    dailyGoalMinutes,
    isPremium,
    selectedTheme,
    presets,
    updateSettings,
    clearSessions,
  } = useTimerStore();

  const handleExportData = () => {
    const data = useTimerStore.getState().sessions;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowstate-sessions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all session data? This cannot be undone.')) {
      clearSessions();
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Notifications */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
          <CardDescription>
            Get gentle reminders when you reach your goal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-sm">
              Enable notifications
            </Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Sound
          </CardTitle>
          <CardDescription>
            Choose your notification sound
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="text-sm">
              Enable sound
            </Label>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>
          
          {soundEnabled && (
            <div className="space-y-2">
              <Label className="text-sm">Sound type</Label>
              <div className="grid grid-cols-2 gap-2">
                {SOUND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSettings({ soundType: option.value })}
                    disabled={option.value !== 'none' && !isPremium && option.value !== 'chime'}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      "border-2 border-border/50",
                      soundType === option.value
                        ? "border-primary bg-primary/20 text-primary"
                        : "hover:border-border",
                      !isPremium && option.value !== 'none' && option.value !== 'chime' && "opacity-50"
                    )}
                  >
                    {option.label}
                    {!isPremium && option.value !== 'none' && option.value !== 'chime' && (
                      <Crown className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize your FlowState experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-sm">
              Dark mode
            </Label>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => updateSettings({ theme: checked ? 'dark' : 'light' })}
            />
          </div>
          
          {/* Theme colors (Premium) */}
          <div className="space-y-2">
            <Label className="text-sm">
              Color theme {!isPremium && <Crown className="w-3 h-3 inline text-primary" />}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => isPremium && updateSettings({ selectedTheme: option.value })}
                  disabled={!isPremium && option.value !== 'default'}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center transition-all",
                    "border-2",
                    selectedTheme === option.value
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/50",
                    !isPremium && option.value !== 'default' && "opacity-50 cursor-not-allowed"
                  )}
                  style={{ background: option.color }}
                >
                  {selectedTheme === option.value && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Daily Goal
          </CardTitle>
          <CardDescription>
            Set your daily focus target (optional, no guilt!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily target</span>
              <span className="font-medium">{dailyGoalMinutes} minutes</span>
            </div>
            <Slider
              value={[dailyGoalMinutes]}
              onValueChange={([value]) => updateSettings({ dailyGoalMinutes: value })}
              min={15}
              max={480}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15m</span>
              <span>8h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer Presets (Premium) */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            Timer Presets
            {!isPremium && <Crown className="w-3 h-3 text-primary" />}
          </CardTitle>
          <CardDescription>
            Customize your quick-start timer options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((preset, i) => (
              <div key={i} className="relative">
                <input
                  type="number"
                  value={preset}
                  onChange={(e) => {
                    if (isPremium) {
                      const newPresets = [...presets];
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value > 0 && value <= 240) {
                        newPresets[i] = value;
                        updateSettings({ presets: newPresets });
                      }
                    }
                  }}
                  disabled={!isPremium}
                  className={cn(
                    "w-full text-center py-2 rounded-lg border-2 border-border/50",
                    "bg-background text-sm font-medium",
                    "focus:outline-none focus:border-primary",
                    !isPremium && "opacity-50 cursor-not-allowed"
                  )}
                  min={1}
                  max={240}
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Data</CardTitle>
          <CardDescription>
            Export or delete your session data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4" />
            Export Session Data
            {!isPremium && <Crown className="w-3 h-3 text-primary ml-auto" />}
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleClearData}
          >
            <Trash2 className="w-4 h-4" />
            Delete All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
