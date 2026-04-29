import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  MoreHorizontal, 
  Download, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PainReport } from '@/types';
import { mockCSVUploads } from '@/data/mockData';
import { toast } from 'sonner';

interface ReportTableProps {
  reports: PainReport[];
  title?: string;
  description?: string;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
  onViewReport?: (report: PainReport) => void;
  onDownloadReport?: (report: PainReport) => void;
}

export function ReportTable({
  reports,
  title = 'Recent Reports',
  description = 'Your latest pain assessments',
  showPagination = true,
  pageSize = 5,
  className,
  onViewReport,
  onDownloadReport,
}: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<PainReport | null>(null);

  const totalPages = Math.ceil(reports.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = reports.slice(startIndex, startIndex + pageSize);

  const getPainScoreColor = (score: number) => {
    if (score <= 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score <= 6) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleViewReport = (report: PainReport) => {
    setSelectedReport(report);
    onViewReport?.(report);
  };

  const handleDownloadReport = (report: PainReport) => {
    onDownloadReport?.(report);
  };

  const handleDeleteReport = (_report: PainReport) => {
    toast.success('Report deleted successfully');
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              {title}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="font-semibold text-slate-700">File Name</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Predicted Pain Score</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Download</TableHead>
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
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, reports.length)} of {reports.length} reports
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
  );
}
