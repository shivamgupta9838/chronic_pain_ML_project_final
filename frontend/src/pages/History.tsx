import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Download, FileText, TrendingUp, TrendingDown, X } from 'lucide-react';
import { TrendChart } from '@/components/ui-custom';
import { toast } from 'sonner';

import { deleteReport, downloadReport, fetchReports } from '@/lib/api';
import type { PainReport } from '@/types';
import { ReportTable } from '@/components/ui-custom/ReportTable';

function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
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
      toast.error(error instanceof Error ? error.message : 'Unable to load report history.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const search = searchQuery.toLowerCase();
      return (
        report.fileName.toLowerCase().includes(search) ||
        new Date(report.uploadedAt).toLocaleDateString().includes(search) ||
        (report.assessmentResult ?? '').toLowerCase().includes(search)
      );
    });
  }, [reports, searchQuery]);

  const reportsWithScore = filteredReports.filter((report) => report.painScore !== null);
  const chartLabels = reportsWithScore.slice().reverse().map((report) => formatShortDate(report.uploadedAt));
  const chartScores = reportsWithScore.slice().reverse().map((report) => Number(report.painScore ?? 0));

  const averageScore = reportsWithScore.length
    ? (reportsWithScore.reduce((sum, report) => sum + Number(report.painScore ?? 0), 0) / reportsWithScore.length).toFixed(1)
    : '-';
  const highestScore = reportsWithScore.length ? Math.max(...chartScores).toFixed(1) : '-';
  const lowestScore = reportsWithScore.length ? Math.min(...chartScores).toFixed(1) : '-';
  const improvingTrend =
    chartScores.length > 1 ? chartScores[chartScores.length - 1] < chartScores[0] : false;

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

  const handleExportAll = async () => {
    try {
      await Promise.all(filteredReports.map((report) => downloadReport(report.id, report.fileName)));
      toast.success('Started downloading all visible reports.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bulk export failed.');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pain History</h1>
          <p className="mt-1 text-slate-500">Live report history from your Flask and MySQL backend.</p>
        </div>

        <Button variant="outline" onClick={() => void handleExportAll()} className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Reports</p>
                <p className="text-2xl font-bold text-slate-800">{filteredReports.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-2xl font-bold text-slate-800">{averageScore}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Score Range</p>
                <p className="text-2xl font-bold text-slate-800">{`${lowestScore}-${highestScore}`}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Overall Trend</p>
                <p className={`text-2xl font-bold ${improvingTrend ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {improvingTrend ? 'Improving' : 'Stable'}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${improvingTrend ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {improvingTrend ? (
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-rose-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        {chartScores.length > 0 ? (
          <TrendChart
            labels={chartLabels}
            predictedScores={chartScores}
            title="Historical Pain Trends"
            description="Complete view of your stored pain assessment scores"
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              Upload reports with pain scores to build your history chart.
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by file name, date, or result..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">Loading history...</CardContent>
        </Card>
      ) : (
        <ReportTable
          reports={filteredReports}
          title="All Reports"
          description="Reports stored in MySQL with downloadable files"
          pageSize={10}
          onDownloadReport={handleDownload}
          onDeleteReport={handleDelete}
        />
      )}
    </Layout>
  );
}
