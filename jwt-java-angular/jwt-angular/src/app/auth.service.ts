import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  username?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as ApiErrorResponse | string | null;

  if (body && typeof body === 'object' && body.message) {
    return body.message;
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  return fallback;
}

export function isUserAlreadyExistsError(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  const body = error.error as ApiErrorResponse | null;
  return error.status === 409 || body?.error === 'USER_ALREADY_EXISTS';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  private apiBaseUrl = '/api';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        if (!res?.token) {
          throw new Error('Brak tokena w odpowiedzi serwera');
        }
        localStorage.setItem('token', res.token);
      }),
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  getProtectedMessage(): Observable<string> {
    return this.http.get(`${this.apiBaseUrl}/hello`, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
