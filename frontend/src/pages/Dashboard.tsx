import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import {
  PainScoreCard,
  TrendChart,
  ReportTable,
  StatCard,
} from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  TrendingUp,
  Activity,
  Plus,
  Upload,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { deleteReport, downloadReport, fetchReports, uploadReport } from '@/lib/api';
import type { DashboardStats, PainReport } from '@/types';

function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reports, setReports] = useState<PainReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadReports();
  }, []);

  async function loadReports() {
    try {
      setIsLoading(true);
      const fetchedReports = await fetchReports();
      setReports(fetchedReports);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load reports.');
    } finally {
      setIsLoading(false);
    }
  }

  const reportsWithScore = reports.filter((report) => report.painScore !== null);
  const recentReports = reports.slice(0, 5);

  const chartData = useMemo(() => {
    const source = reportsWithScore.slice(0, 7).reverse();
    return {
      labels: source.map((report) => formatShortDate(report.uploadedAt)),
      predictedScores: source.map((report) => Number(report.painScore ?? 0)),
    };
  }, [reportsWithScore]);

  const stats = useMemo<DashboardStats>(() => {
    if (reportsWithScore.length === 0) {
      return {
        latestPainScore: 0,
        averagePainScore: 0,
        totalReports: reports.length,
        trendDirection: 'stable' as const,
        trendPercentage: 0,
      };
    }

    const latestPainScore = Number(reportsWithScore[0].painScore ?? 0);
    const averagePainScore =
      reportsWithScore.reduce((total, report) => total + Number(report.painScore ?? 0), 0) /
      reportsWithScore.length;

    const previousPainScore = Number(reportsWithScore[1]?.painScore ?? latestPainScore);
    const delta = latestPainScore - previousPainScore;
    const trendDirection: DashboardStats['trendDirection'] =
      delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable';
    const trendPercentage =
      previousPainScore > 0 ? Math.round((Math.abs(delta) / previousPainScore) * 100) : 0;

    return {
      latestPainScore,
      averagePainScore,
      totalReports: reports.length,
      trendDirection,
      trendPercentage,
    };
  }, [reports, reportsWithScore]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'text/csv' || file.name.endsWith('.csv'),
    );

    if (droppedFiles.length === 0) {
      toast.error('Please upload CSV files only.');
      return;
    }

    setUploadFile(droppedFiles[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(35);

    try {
      const report = await uploadReport({
        file: uploadFile,
      });

      setUploadProgress(100);
      setReports((currentReports) => [report, ...currentReports]);
      toast.success('File uploaded and processed successfully.');
      setIsModalOpen(false);
      resetUploadForm();
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(error instanceof Error ? error.message : 'Upload failed.');
    }
  };

  const handleDownload = async (report: PainReport) => {
    try {
      await downloadReport(report.id, report.fileName);
      toast.success(`Downloading ${report.fileName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed.');
    }
  };

  const handleDelete = async (report: PainReport) => {
    try {
      await deleteReport(report.id);
      setReports((currentReports) => currentReports.filter((item) => item.id !== report.id));
      toast.success('Report deleted successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed.');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-slate-500">Your live pain assessment data from the Flask backend.</p>
        </div>

        <Button
          className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Assessment
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Latest Pain Score"
          value={stats.latestPainScore ? stats.latestPainScore.toFixed(1) : '-'}
          subtitle={stats.latestPainScore ? '/10' : undefined}
          icon={Activity}
          variant="primary"
          trend={{ value: stats.trendPercentage, label: 'vs previous report', direction: stats.trendDirection }}
        />

        <StatCard
          title="Average Score"
          value={stats.averagePainScore ? stats.averagePainScore.toFixed(1) : '-'}
          subtitle={stats.averagePainScore ? '/10' : undefined}
          icon={TrendingUp}
          variant="default"
          trend={{ value: stats.trendPercentage, label: 'report trend', direction: stats.trendDirection }}
        />

        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          icon={FileText}
          variant="success"
          trend={{ value: reports.length, label: 'records stored', direction: 'up' }}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PainScoreCard
          score={stats.latestPainScore}
          trendDirection={stats.trendDirection}
          trendPercentage={stats.trendPercentage}
          className="lg:col-span-1"
          description={
            reportsWithScore.length > 0
              ? 'Based on your most recent stored assessment'
              : 'Upload your first report to see a score'
          }
        />

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Backend Connected</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      CSV uploads are now stored in Flask and persisted in MySQL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Latest Assessment</span>
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  {recentReports[0]?.fileName ?? 'No reports uploaded yet'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {recentReports[0]?.uploadedAt
                    ? new Date(recentReports[0].uploadedAt).toLocaleString()
                    : 'Upload a CSV to populate this section'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        {chartData.predictedScores.length > 0 ? (
          <TrendChart
            labels={chartData.labels}
            predictedScores={chartData.predictedScores}
            title="Pain Trend Analysis"
            description="Recent pain scores stored in your backend reports"
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              Upload reports with pain scores to see your trend chart.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-8">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">Loading reports...</CardContent>
          </Card>
        ) : (
          <ReportTable
            reports={recentReports}
            title="Recent Reports"
            description="Your latest pain assessments from MySQL"
            showPagination={false}
            onDownloadReport={handleDownload}
            onDeleteReport={handleDelete}
          />
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            resetUploadForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
              <Upload className="w-5 h-5 text-teal-600" />
              New Assessment
            </DialogTitle>
            <DialogDescription>
              Upload a person CSV and the trained model will predict the pain score automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
                ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'}
              `}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />

              <div className="flex flex-col items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isDragging ? 'bg-teal-100' : 'bg-slate-100'}`}>
                  <FileSpreadsheet className={`w-7 h-7 ${isDragging ? 'text-teal-600' : 'text-slate-500'}`} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Drag and drop your CSV file here</p>
                  <p className="mt-1 text-xs text-slate-500">or click to browse files</p>
                </div>

                <label htmlFor="csv-upload">
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </div>
            </div>

            {uploadFile && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">{uploadFile.name}</p>
                  <p className="text-xs text-slate-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => setUploadFile(null)}
                  className="rounded p-1 hover:bg-slate-200"
                  type="button"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Uploading...</span>
                  <span className="text-slate-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Required CSV columns for the model</p>
              <div className="flex flex-wrap gap-2">
                {['person_ID', 'acc_x', 'acc_y', 'acc_z', 'eda', 'bvp', 'hr', 'temp'].map((column) => (
                  <span
                    key={column}
                    className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
                  >
                    {column}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                The backend applies your notebook feature engineering and averages the model predictions into one pain score.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                onClick={() => void handleUpload()}
                disabled={!uploadFile || isUploading}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Processing...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
