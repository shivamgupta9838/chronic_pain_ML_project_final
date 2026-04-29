import type { User } from '@/types';

const TOKEN_KEY = 'painai_access_token';
const USER_KEY = 'painai_user';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(accessToken: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    clearSession();
    return null;
  }
}
