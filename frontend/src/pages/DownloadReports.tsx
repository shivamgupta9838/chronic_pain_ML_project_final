import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileDown, FileSpreadsheet, Search, Download, UserRound, Activity } from 'lucide-react';
import { toast } from 'sonner';

import { downloadReport, fetchCurrentUser, fetchReports } from '@/lib/api';
import { formatPainScore } from '@/lib/formatPainScore';
import { downloadAllReportsPdf, downloadSingleReportPdf } from '@/lib/reportPdf';
import { getStoredUser } from '@/lib/auth';
import type { PainReport, User } from '@/types';

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getScoreVariant(score: number | null): string {
  if (score === null) {
    return 'border-slate-200 bg-slate-100 text-slate-600';
  }
  if (score <= 3) {
    return 'border-emerald-200 bg-emerald-100 text-emerald-700';
  }
  if (score <= 6) {
    return 'border-amber-200 bg-amber-100 text-amber-700';
  }
  return 'border-rose-200 bg-rose-100 text-rose-700';
}

function splitAssessment(assessmentResult: string | null): string[] {
  if (!assessmentResult) {
    return ['No stored analysis summary for this upload.'];
  }

  return assessmentResult
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DownloadReports() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [reports, setReports] = useState<PainReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activePdfId, setActivePdfId] = useState<number | 'all' | null>(null);
  const [activeCsvId, setActiveCsvId] = useState<number | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [currentUser, fetchedReports] = await Promise.all([fetchCurrentUser(), fetchReports()]);
      setUser(currentUser);
      setReports(fetchedReports);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load downloadable reports.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredReports = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) {
      return reports;
    }

    return reports.filter((report) => {
      return (
        report.fileName.toLowerCase().includes(search) ||
        formatDate(report.uploadedAt).toLowerCase().includes(search) ||
        (report.assessmentResult ?? '').toLowerCase().includes(search)
      );
    });
  }, [reports, searchQuery]);

  const scoredReports = filteredReports.filter((report) => report.painScore !== null);
  const averageScore = scoredReports.length
    ? (scoredReports.reduce((sum, report) => sum + Number(report.painScore ?? 0), 0) / scoredReports.length).toFixed(1)
    : '-';

  const handlePdfDownload = async (report: PainReport) => {
    try {
      setActivePdfId(report.id);
      downloadSingleReportPdf(report, reports, user);
      toast.success(`PDF report downloaded for ${report.fileName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate PDF report.');
    } finally {
      setActivePdfId(null);
    }
  };

  const handleAllPdfDownload = async () => {
    try {
      setActivePdfId('all');
      downloadAllReportsPdf(filteredReports, user);
      toast.success('Combined PDF summary downloaded.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate combined PDF.');
    } finally {
      setActivePdfId(null);
    }
  };

  const handleCsvDownload = async (report: PainReport) => {
    try {
      setActiveCsvId(report.id);
      await downloadReport(report.id, report.fileName);
      toast.success(`CSV downloaded for ${report.fileName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to download CSV file.');
    } finally {
      setActiveCsvId(null);
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Download Reports</h1>
          <p className="mt-1 text-slate-500">
            Review every upload and export patient-friendly PDF analysis reports from one place.
          </p>
        </div>

        <Button
          onClick={() => void handleAllPdfDownload()}
          className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
          disabled={filteredReports.length === 0 || activePdfId === 'all'}
        >
          <FileDown className="h-4 w-4" />
          {activePdfId === 'all' ? 'Preparing Summary PDF...' : 'Download Summary PDF'}
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Visible Uploads</p>
              <p className="text-2xl font-bold text-slate-800">{filteredReports.length}</p>
            </div>
            <div className="rounded-xl bg-teal-100 p-3">
              <FileSpreadsheet className="h-6 w-6 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Average Pain Score</p>
              <p className="text-2xl font-bold text-slate-800">{averageScore}</p>
            </div>
            <div className="rounded-xl bg-amber-100 p-3">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Patient Profile</p>
              <p className="text-lg font-semibold text-slate-800">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading profile'}
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3">
              <UserRound className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
              placeholder="Search uploads by file name, date, or analysis text..."
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">Loading downloadable reports...</CardContent>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            No uploads matched your search. Try another keyword or upload a new CSV first.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/80">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                      <FileSpreadsheet className="h-5 w-5 text-teal-600" />
                      {report.fileName}
                    </CardTitle>
                    <CardDescription>Uploaded on {formatDate(report.uploadedAt)}</CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={getScoreVariant(report.painScore)}>
                      {report.painScore !== null ? `${formatPainScore(report.painScore)}/8` : 'No score'}
                    </Badge>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => void handleCsvDownload(report)}
                      disabled={activeCsvId === report.id}
                    >
                      <Download className="h-4 w-4" />
                      {activeCsvId === report.id ? 'Downloading CSV...' : 'CSV'}
                    </Button>
                    <Button
                      className="gap-2 bg-teal-600 text-white hover:bg-teal-700"
                      onClick={() => void handlePdfDownload(report)}
                      disabled={activePdfId === report.id}
                    >
                      <FileDown className="h-4 w-4" />
                      {activePdfId === report.id ? 'Preparing PDF...' : 'PDF Report'}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid gap-6 p-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Patient Analysis Snapshot</p>
                  <p className="mt-3 text-3xl font-bold text-slate-800">
                    {formatPainScore(report.painScore)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {report.painScore !== null ? 'Predicted pain score out of 8' : 'No prediction stored'}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Stored analysis</p>
                  {splitAssessment(report.assessmentResult).map((item) => (
                    <div key={`${report.id}-${item}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
