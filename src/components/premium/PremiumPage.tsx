'use client';

import { useTimerStore } from '@/store/timer-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  BarChart3, 
  Palette, 
  Clock, 
  Download,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Weekly and monthly pattern insights',
    premium: true,
  },
  {
    icon: Clock,
    title: 'Custom Time Presets',
    description: 'Create your own timer shortcuts',
    premium: true,
  },
  {
    icon: Palette,
    title: 'Multiple Themes',
    description: 'Ocean, Forest, Sunset color schemes',
    premium: true,
  },
  {
    icon: Sparkles,
    title: 'Focus Sounds',
    description: 'Ambient sounds for deeper focus',
    premium: true,
  },
  {
    icon: Download,
    title: 'Data Export',
    description: 'Export your session history',
    premium: true,
  },
];

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$2.99',
    period: '/month',
    description: 'Perfect for trying out premium',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$19.99',
    period: '/year',
    description: 'Save 45%!',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$49.99',
    period: ' once',
    description: 'Pay once, own forever',
  },
];

export function PremiumPage() {
  const { isPremium, updateSettings } = useTimerStore();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    // Simulate subscription (in real app, this would be a Stripe integration)
    setTimeout(() => {
      updateSettings({ isPremium: true });
      setIsLoading(false);
    }, 1500);
  };

  if (isPremium) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div 
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
          style={{ background: 'oklch(0.7 0.16 180 / 0.2)' }}
        >
          <Crown className="w-10 h-10" style={{ color: 'oklch(0.75 0.14 180)' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">You&apos;re a Pro!</h2>
          <p className="text-muted-foreground mt-1">
            Thanks for supporting FlowState
          </p>
        </div>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              All premium features are unlocked. Enjoy your enhanced focus experience!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div 
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ background: 'oklch(0.7 0.16 180 / 0.2)' }}
        >
          <Crown className="w-8 h-8" style={{ color: 'oklch(0.75 0.14 180)' }} />
        </div>
        <h2 className="text-2xl font-bold">FlowState Pro</h2>
        <p className="text-muted-foreground text-sm">
          Unlock the full potential of your focus
        </p>
      </div>

      {/* Features list */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="py-4 space-y-3">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'oklch(0.7 0.16 180 / 0.15)' }}
              >
                <feature.icon className="w-4 h-4" style={{ color: 'oklch(0.75 0.14 180)' }} />
              </div>
              <div>
                <p className="font-medium text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Free tier comparison */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Card className="bg-card/30 border-border/30">
          <CardContent className="py-3 text-center">
            <p className="font-medium mb-1">Free</p>
            <p className="text-xs text-muted-foreground">Basic timer & tracking</p>
          </CardContent>
        </Card>
        <Card 
          className="border-2"
          style={{ borderColor: 'oklch(0.7 0.16 180 / 0.5)' }}
        >
          <CardContent className="py-3 text-center">
            <p className="font-medium mb-1" style={{ color: 'oklch(0.75 0.14 180)' }}>
              Pro
            </p>
            <p className="text-xs text-muted-foreground">Full experience</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing plans */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-center">Choose your plan</p>
        <div className="grid gap-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative w-full p-4 rounded-xl border-2 text-left transition-all",
                selectedPlan === plan.id
                  ? "border-primary bg-primary/10"
                  : "border-border/50 hover:border-border"
              )}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-2 right-4 text-xs"
                  style={{ background: 'oklch(0.7 0.16 180)' }}
                >
                  Most Popular
                </Badge>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{plan.price}</p>
                  <p className="text-xs text-muted-foreground">{plan.period}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Subscribe button */}
      <Button
        className="w-full py-6 text-lg font-medium"
        style={{ background: 'oklch(0.7 0.16 180)' }}
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 animate-pulse" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Get FlowState Pro
          </span>
        )}
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground">
        Cancel anytime. No questions asked.
      </p>
    </div>
  );
}
