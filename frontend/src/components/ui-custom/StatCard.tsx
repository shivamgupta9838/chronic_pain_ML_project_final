import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral' | 'stable';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: {
      card: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    primary: {
      card: 'bg-white',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    success: {
      card: 'bg-white',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    warning: {
      card: 'bg-white',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    danger: {
      card: 'bg-white',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
  };

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-slate-500',
    stable: 'text-slate-500',
  };

  const styles = variantStyles[variant];
  const directionSymbol = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';

  return (
    <Card className={cn(styles.card, className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{value}</span>
              {subtitle && <span className="text-sm text-slate-400">{subtitle}</span>}
            </div>

            {trend && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className={cn('text-sm font-medium', trendColors[trend.direction])}>
                  {directionSymbol} {trend.value}%
                </span>
                <span className="text-sm text-slate-500">{trend.label}</span>
              </div>
            )}
          </div>

          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', styles.iconBg)}>
            <Icon className={cn('w-6 h-6', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
