export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  authProvider: string;
  avatarUrl?: string | null;
  createdAt: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string[];
}

export interface PainReport {
  id: number;
  userId: number;
  fileName: string;
  storedFileName: string;
  filePath: string;
  painScore: number | null;
  assessmentResult: string | null;
  uploadedAt: string;
  date?: string;
  predictedScore?: number;
  location?: string;
  triggers?: string[];
  medications?: string[];
  notes?: string;
  status?: 'pending' | 'completed' | 'reviewed';
}

export interface CSVUpload {
  id: string;
  fileName: string;
  uploadDate: string;
  rowCount: number;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface DashboardStats {
  latestPainScore: number;
  averagePainScore: number;
  totalReports: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface PainTrendData {
  labels: string[];
  actualScores: number[];
  predictedScores: number[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
