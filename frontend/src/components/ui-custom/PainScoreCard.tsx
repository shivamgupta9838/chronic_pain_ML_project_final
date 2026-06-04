import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Minus, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PainScoreCardProps {
  score: number;
  trendDirection?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  label?: string;
  description?: string;
  className?: string;
}

export function PainScoreCard({
  score,
  trendDirection = 'stable',
  trendPercentage = 0,
  label = 'Latest Pain Score',
  description = 'Based on your most recent assessment',
  className,
}: PainScoreCardProps) {
  // Determine color based on pain score
  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-emerald-500';
    if (score <= 6) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score <= 3) return 'bg-emerald-50';
    if (score <= 6) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Mild';
    if (score <= 6) return 'Moderate';
    return 'Severe';
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor = trendDirection === 'up' ? 'text-rose-500' : trendDirection === 'down' ? 'text-emerald-500' : 'text-slate-500';
  const trendText = trendDirection === 'up' ? 'Higher' : trendDirection === 'down' ? 'Lower' : 'Stable';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">{label}</CardTitle>
          <div className="p-2 rounded-lg bg-slate-100">
            <Activity className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-5xl font-bold", getScoreColor(score))}>
            {score}
          </span>
          <span className="text-lg text-slate-400">/8</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getScoreBg(score), getScoreColor(score))}>
            {getScoreLabel(score)}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-500">{description}</p>

        {trendPercentage > 0 && (
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
            <TrendIcon className={cn("w-4 h-4", trendColor)} />
            <span className={cn("text-sm font-medium", trendColor)}>
              {trendPercentage}%
            </span>
            <span className="text-sm text-slate-500">
              {trendText} than last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
