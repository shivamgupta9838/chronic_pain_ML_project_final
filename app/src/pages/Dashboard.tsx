import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  PainScoreCard, 
  TrendChart, 
  ReportTable,
  StatCard 
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
  FileSpreadsheet
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  mockPainReports, 
  mockPainTrendData, 
  mockDashboardStats 
} from '@/data/mockData';
import { toast } from 'sonner';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleViewReport = (report: typeof mockPainReports[0]) => {
    toast.info(`Viewing report from ${report.date}`);
  };

  const handleDownloadReport = (report: typeof mockPainReports[0]) => {
    toast.success(`Downloading report from ${report.date}`);
  };

  const recentReports = mockPainReports.slice(0, 5);

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
      file => file.type === 'text/csv' || file.name.endsWith('.csv')
    );
    
    if (droppedFiles.length === 0) {
      toast.error('Please upload CSV files only');
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

  const handleUpload = () => {
    if (!uploadFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setIsModalOpen(false);
            setUploadFile(null);
            setUploadProgress(0);
            toast.success('File uploaded and processed successfully!');
            toast.info('Predicted pain score chart has been updated.');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your pain management overview.</p>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Assessment
        </Button>
      </div>

      {/* Stats Grid - Removed AI Predictions card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Latest Pain Score"
          value={mockDashboardStats.latestPainScore}
          subtitle="/10"
          icon={Activity}
          variant="primary"
          trend={{ value: 12.5, label: 'vs last week', direction: 'down' }}
        />
        
        <StatCard
          title="Average Score"
          value={mockDashboardStats.averagePainScore}
          subtitle="/10"
          icon={TrendingUp}
          variant="default"
          trend={{ value: 5.2, label: 'vs last month', direction: 'down' }}
        />
        
        <StatCard
          title="Total Reports"
          value={mockDashboardStats.totalReports}
          icon={FileText}
          variant="success"
          trend={{ value: 8, label: 'new this week', direction: 'up' }}
        />
      </div>

      {/* Main Content Grid - Removed AI Insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pain Score Card */}
        <PainScoreCard
          score={mockDashboardStats.latestPainScore}
          trendDirection={mockDashboardStats.trendDirection}
          trendPercentage={mockDashboardStats.trendPercentage}
          className="lg:col-span-1"
        />

        {/* Quick Stats Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Data Uploads</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Upload your wearable sensor data (BVP, EDA, accelerometer, temperature) for pain prediction analysis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Latest Prediction</span>
                </div>
                <p className="text-lg font-semibold text-slate-800">Pain Score: 5.2/10</p>
                <p className="text-xs text-slate-500 mt-1">Based on latest sensor data</p>
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
          title="Pain Trend Analysis"
          description="Track your predicted pain levels over time"
        />
      </div>

      {/* Recent Reports Table */}
      <div className="mb-8">
        <ReportTable
          reports={recentReports}
          title="Recent Reports"
          description="Your latest pain assessments"
          showPagination={false}
          onViewReport={handleViewReport}
          onDownloadReport={handleDownloadReport}
        />
      </div>

      {/* New Assessment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-600" />
              New Assessment
            </DialogTitle>
            <DialogDescription>
              Upload your wearable sensor data for pain prediction analysis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${isDragging 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
                }
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
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center transition-colors
                  ${isDragging ? 'bg-teal-100' : 'bg-slate-100'}
                `}>
                  <FileSpreadsheet className={`
                    w-7 h-7 transition-colors
                    ${isDragging ? 'text-teal-600' : 'text-slate-500'}
                  `} />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    or click to browse files
                  </p>
                </div>
                
                <label htmlFor="csv-upload">
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Selected File */}
            {uploadFile && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {uploadFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button 
                  onClick={() => setUploadFile(null)}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Uploading...</span>
                  <span className="text-slate-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Required Columns Info */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Required CSV columns:</p>
              <div className="flex flex-wrap gap-2">
                {['bvp', 'eda', 'x', 'y', 'z', 'temperature'].map((col) => (
                  <span 
                    key={col}
                    className="px-2 py-1 bg-white rounded text-xs font-medium text-slate-600 border border-slate-200"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsModalOpen(false);
                  setUploadFile(null);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white gap-2"
                onClick={handleUpload}
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
