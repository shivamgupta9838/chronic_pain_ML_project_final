import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { TrendChart } from '@/components/ui-custom';
import { mockPainReports, mockPainTrendData, mockCSVUploads } from '@/data/mockData';
import type { PainReport } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<PainReport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter reports by file name or date
  const filteredReports = mockPainReports.filter(report => {
    const csvFile = mockCSVUploads.find(csv => csv.id === report.id) || { fileName: `wearable_data_${report.date.replace(/-/g, '')}.csv` };
    const matchesSearch = 
      csvFile.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.date.includes(searchQuery);
    
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);

  const handleViewReport = (r: PainReport) => {
    setSelectedReport(r);
  };

  const handleDownloadReport = (report: PainReport) => {
    const csvFile = mockCSVUploads.find(csv => csv.id === report.id) || { fileName: `wearable_data_${report.date.replace(/-/g, '')}.csv` };
    toast.success(`Downloading ${csvFile.fileName}`);
  };

  const handleDeleteReport = (_report: PainReport) => {
    toast.success('Report deleted successfully');
  };

  const handleExportAll = () => {
    toast.success('Exporting all reports as CSV...');
  };

  const getPainScoreColor = (score: number) => {
    if (score <= 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score <= 6) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Calculate summary stats based on predicted scores
  const predictedScores = mockPainTrendData.predictedScores;
  const averageScore = (predictedScores.reduce((acc, s) => acc + s, 0) / predictedScores.length).toFixed(1);
  const highestScore = Math.max(...predictedScores);
  const lowestScore = Math.min(...predictedScores);
  const improvingTrend = predictedScores.length > 1 && 
    predictedScores[predictedScores.length - 1] < predictedScores[0];

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pain History</h1>
          <p className="text-slate-500 mt-1">View and analyze your complete pain assessment history</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleExportAll}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Reports</p>
                <p className="text-2xl font-bold text-slate-800">{filteredReports.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
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
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
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
                <p className="text-2xl font-bold text-slate-800">{lowestScore}-{highestScore}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
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
                <p className={cn(
                  "text-2xl font-bold",
                  improvingTrend ? "text-emerald-600" : "text-rose-600"
                )}>
                  {improvingTrend ? 'Improving' : 'Stable'}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                improvingTrend ? "bg-emerald-100" : "bg-rose-100"
              )}>
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

      {/* Trend Chart - Shows only predicted scores */}
      <div className="mb-8">
        <TrendChart
          labels={mockPainTrendData.labels}
          predictedScores={mockPainTrendData.predictedScores}
          title="Historical Pain Trends"
          description="Complete view of your predicted pain levels over time"
        />
      </div>

      {/* Search Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by file name or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Table - Simplified */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800">
            All Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700">File Name</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Predicted Pain Score</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Download Report</TableHead>
                  <TableHead className="font-semibold text-slate-700 w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => {
                  const csvFile = mockCSVUploads.find(csv => csv.id === report.id) || { 
                    fileName: `wearable_data_${report.date.replace(/-/g, '')}.csv` 
                  };
                  
                  return (
                    <TableRow key={report.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {formatDate(report.date)}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-teal-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {csvFile.fileName}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {report.predictedScore ? (
                          <Badge 
                            variant="outline" 
                            className={cn("font-semibold", getPainScoreColor(Math.round(report.predictedScore)))}
                          >
                            {report.predictedScore.toFixed(1)}/10
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReport(report)}
                          className="gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </TableCell>
                      
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewReport(report)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Report Details</DialogTitle>
                              <DialogDescription>
                                {formatDate(report.date)}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedReport && (
                              <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3 mb-4">
                                    <FileSpreadsheet className="w-8 h-8 text-teal-500" />
                                    <div>
                                      <p className="font-medium text-slate-800">
                                        {csvFile.fileName}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        CSV Data File
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-teal-50 rounded-lg text-center border border-teal-100">
                                    <p className="text-sm text-slate-500 mb-1">Predicted Pain Score</p>
                                    <p className="text-3xl font-bold text-teal-600">
                                      {report.predictedScore?.toFixed(1) || '-'}/10
                                    </p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                                    <p className="text-sm text-slate-500 mb-1">Upload Date</p>
                                    <p className="text-lg font-semibold text-slate-700">
                                      {formatDate(report.date)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex gap-3">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1 gap-2"
                                    onClick={() => handleDownloadReport(report)}
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1 gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                    onClick={() => handleDeleteReport(report)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredReports.length)} of {filteredReports.length} reports
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-slate-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
