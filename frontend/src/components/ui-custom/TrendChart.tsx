import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  labels: string[];
  predictedScores: number[];
  title?: string;
  description?: string;
  className?: string;
}

export function TrendChart({
  labels,
  predictedScores,
  title = 'Pain Trend Analysis',
  description = 'Track your predicted pain levels over time',
  className,
}: TrendChartProps) {
  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Predicted Pain Score',
        data: predictedScores,
        borderColor: '#0d9488', // teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}/10`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: '#94a3b8',
        },
      },
      y: {
        min: 1,
        max: 10,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: '#94a3b8',
          callback: (value) => `${value}`,
        },
        title: {
          display: true,
          text: 'Pain Score (1-10)',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: '#64748b',
        },
      },
    },
  };

  // Calculate trend based on predicted scores
  const calculateTrend = () => {
    if (predictedScores.length < 2) return { direction: 'stable' as const, percentage: 0 };

    const firstScore = predictedScores[0];
    const latestScore = predictedScores[predictedScores.length - 1];
    const delta = latestScore - firstScore;
    const percentage = firstScore !== 0 ? Math.abs(Math.round((delta / firstScore) * 100)) : 0;

    if (delta === 0) return { direction: 'stable' as const, percentage };
    if (delta > 0) return { direction: 'up' as const, percentage };
    return { direction: 'down' as const, percentage };
  };

  const trend = calculateTrend();
  const TrendIcon =
    trend.direction === 'down' ? TrendingDown : trend.direction === 'up' ? TrendingUp : Minus;

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              {title}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          
          {/* Trend Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
            <TrendIcon className={cn(
              "w-4 h-4",
              trend.direction === 'down' ? "text-emerald-500" : 
              trend.direction === 'up' ? "text-rose-500" : "text-slate-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              trend.direction === 'down' ? "text-emerald-600" : 
              trend.direction === 'up' ? "text-rose-600" : "text-slate-600"
            )}>
              {trend.direction === 'down' ? 'Improving' : 
               trend.direction === 'up' ? 'Increasing' : 'Stable'}
            </span>
          </div>
        </div>
        
        {/* Time Range */}
        <div className="flex items-center gap-2 mt-3">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">
            Last {labels.length} days
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Legend / Stats */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500">Average</p>
            <p className="text-lg font-semibold text-slate-800">
              {(predictedScores.reduce((a, b) => a + b, 0) / predictedScores.length).toFixed(1)}
            </p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-xs text-slate-500">Highest</p>
            <p className="text-lg font-semibold text-rose-600">
              {Math.max(...predictedScores)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Lowest</p>
            <p className="text-lg font-semibold text-emerald-600">
              {Math.min(...predictedScores)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
