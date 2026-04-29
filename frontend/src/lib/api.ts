import { clearSession, getAccessToken } from '@/lib/auth';
import type { PainReport, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000/api';

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface ApiOptions {
  method?: RequestMethod;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  auth?: boolean;
}

interface BackendUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  auth_provider: string;
  avatar_url?: string | null;
  phone?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  created_at: string;
}

interface BackendReport {
  id: number;
  user_id: number;
  original_file_name: string;
  stored_file_name: string;
  file_path: string;
  pain_score: number | null;
  assessment_result: string | null;
  uploaded_at: string;
}

interface AuthResponse {
  access_token: string;
  user: BackendUser;
  message: string;
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    authProvider: user.auth_provider,
    avatarUrl: user.avatar_url ?? null,
    phone: user.phone ?? '',
    address: user.address ?? '',
    dateOfBirth: user.date_of_birth ?? '',
    createdAt: user.created_at,
  };
}

function mapReport(report: BackendReport): PainReport {
  return {
    id: report.id,
    userId: report.user_id,
    fileName: report.original_file_name,
    storedFileName: report.stored_file_name,
    filePath: report.file_path,
    painScore: report.pain_score,
    assessmentResult: report.assessment_result,
    uploadedAt: report.uploaded_at,
  };
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ?? null,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message)
        : 'Request failed.';
    const detail =
      typeof payload === 'object' && payload && 'detail' in payload
        ? String(payload.detail)
        : '';

    if (response.status === 401) {
      clearSession();
    }

    throw new Error(detail ? `${message} ${detail}` : message);
  }

  return payload as T;
}

export async function registerUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ accessToken: string; user: User; message: string }> {
  const payload = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: input.password,
    }),
  });

  return {
    accessToken: payload.access_token,
    user: mapUser(payload.user),
    message: payload.message,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; user: User; message: string }> {
  const payload = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(input),
  });

  return {
    accessToken: payload.access_token,
    user: mapUser(payload.user),
    message: payload.message,
  };
}

export async function loginWithGoogle(idToken: string): Promise<{ accessToken: string; user: User; message: string }> {
  const payload = await apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ id_token: idToken }),
  });

  return {
    accessToken: payload.access_token,
    user: mapUser(payload.user),
    message: payload.message,
  };
}

export async function fetchCurrentUser(): Promise<User> {
  const payload = await apiRequest<{ user: BackendUser }>('/auth/me');
  return mapUser(payload.user);
}

export async function updateCurrentUser(input: {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}): Promise<User> {
  const payload = await apiRequest<{ user: BackendUser }>('/auth/me', {
    method: 'PUT',
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone ?? '',
      address: input.address ?? '',
      date_of_birth: input.dateOfBirth ?? '',
    }),
  });

  return mapUser(payload.user);
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  await apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: input.currentPassword,
      new_password: input.newPassword,
      confirm_password: input.confirmPassword,
    }),
  });
}

export async function fetchReports(): Promise<PainReport[]> {
  const payload = await apiRequest<{ reports: BackendReport[] }>('/reports');
  return payload.reports.map(mapReport);
}

export async function uploadReport(input: {
  file: File;
}): Promise<PainReport> {
  const formData = new FormData();
  formData.append('file', input.file);

  const payload = await apiRequest<{ report: BackendReport }>('/reports', {
    method: 'POST',
    body: formData,
  });

  return mapReport(payload.report);
}

export async function deleteReport(reportId: number): Promise<void> {
  await apiRequest<{ message: string }>(`/reports/${reportId}`, {
    method: 'DELETE',
  });
}

export async function downloadReport(reportId: number, fileName: string): Promise<void> {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Unable to download report.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
