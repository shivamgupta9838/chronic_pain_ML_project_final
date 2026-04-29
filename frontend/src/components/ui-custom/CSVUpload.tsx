import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CSVUploadProps {
  onUpload?: (file: File) => void;
  className?: string;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

export function CSVUpload({ onUpload, className }: CSVUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'text/csv' || file.name.endsWith('.csv')
    );
    
    if (droppedFiles.length === 0) {
      toast.error('Please upload CSV files only');
      return;
    }
    
    droppedFiles.forEach(processFile);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(processFile);
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const processFile = (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const newFile: UploadFile = {
      id,
      file,
      progress: 0,
      status: 'uploading',
    };
    
    setFiles(prev => [...prev, newFile]);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev =>
          prev.map(f =>
            f.id === id ? { ...f, progress: 100, status: 'completed' } : f
          )
        );
        
        toast.success(`Successfully uploaded ${file.name}`);
        onUpload?.(file);
      } else {
        setFiles(prev =>
          prev.map(f =>
            f.id === id ? { ...f, progress } : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Upload Pain Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-teal-500 bg-teal-50"
              : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
              isDragging ? "bg-teal-100" : "bg-slate-100"
            )}>
              <Upload className={cn(
                "w-7 h-7 transition-colors",
                isDragging ? "text-teal-600" : "text-slate-500"
              )} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                CSV files only (max 10MB)
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Select Files
            </Button>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Uploaded Files</h4>
            
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.file.size / 1024).toFixed(1)} KB
                  </p>
                  
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={file.progress} className="h-1.5" />
                      <p className="text-xs text-slate-500 mt-1">
                        {Math.round(file.progress)}%
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Download */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Need a template?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-medium underline">
              Download sample CSV
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
