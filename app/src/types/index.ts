// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string[];
  createdAt: string;
}

// Pain Report Types
export interface PainReport {
  id: string;
  userId: string;
  date: string;
  painScore: number;
  predictedScore?: number;
  location: string;
  triggers: string[];
  medications: string[];
  notes: string;
  status: 'pending' | 'completed' | 'reviewed';
}

// CSV Upload Types
export interface CSVUpload {
  id: string;
  fileName: string;
  uploadDate: string;
  rowCount: number;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

// Dashboard Stats
export interface DashboardStats {
  latestPainScore: number;
  averagePainScore: number;
  totalReports: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

// Chart Data
export interface PainTrendData {
  labels: string[];
  actualScores: number[];
  predictedScores: number[];
}

// Navigation Item
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
