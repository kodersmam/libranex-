import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, UserProfile } from './auth.service';

interface JwtPayload {
  sub?: string;
  iat?: number;
  exp?: number;
}

interface SessionInfo {
  tokenUsername: string;
  issuedAt: Date | null;
  expiresAt: Date | null;
  isValid: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<UserProfile | null>(null);
  session = signal<SessionInfo | null>(null);
  protectedMessage = signal('');
  loading = signal(true);
  error = signal('');
  apiLoading = signal(true);
  profileLoadedAt = signal<Date | null>(null);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);
    this.error.set('');
    this.apiLoading.set(true);
    this.session.set(this.readSessionFromToken());

    forkJoin({
      profile: this.authService.getProfile(),
      hello: this.authService.getProtectedMessage(),
    }).subscribe({
      next: ({ profile, hello }) => {
        this.user.set(profile);
        this.protectedMessage.set(hello);
        this.profileLoadedAt.set(new Date());
        this.loading.set(false);
        this.apiLoading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.apiLoading.set(false);
        this.error.set('Nie udało się pobrać danych użytkownika. Zaloguj się ponownie.');
      },
    });
  }

  private readSessionFromToken(): SessionInfo | null {
    const token = this.authService.getToken();
    if (!token) return null;

    const payload = this.decodeJwt(token);
    if (!payload) return null;

    const issuedAt = payload.iat ? new Date(payload.iat * 1000) : null;
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
    const isValid = expiresAt ? expiresAt.getTime() > Date.now() : true;

    return {
      tokenUsername: payload.sub ?? '',
      issuedAt,
      expiresAt,
      isValid,
    };
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const json = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  initials(): string {
    const name = this.user()?.username?.trim();
    if (!name) return '?';
    const parts = name.split(/[.\s_-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  roleLabel(): string {
    return this.user()?.role?.replace('ROLE_', '') ?? 'USER';
  }

  roleLabelPl(): string {
    const labels: Record<string, string> = {
      USER: 'Użytkownik',
      ADMIN: 'Administrator',
    };
    return labels[this.roleLabel()] ?? this.roleLabel();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Cześć';
    return 'Dobry wieczór';
  }

  todayLabel(): string {
    return new Date().toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  sessionStatusLabel(): string {
    const currentSession = this.session();
    if (!currentSession) return 'Brak danych sesji';
    return currentSession.isValid ? 'Aktywna' : 'Wygasła';
  }

  formatDateTime(date: Date | null): string {
    if (!date) return '—';
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
