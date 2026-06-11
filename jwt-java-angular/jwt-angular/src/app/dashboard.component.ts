import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from './auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: UserProfile | null = null;
  protectedMessage = '';
  loading = true;
  error = '';
  apiLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = '';

    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.loading = false;

        this.authService.getProtectedMessage().subscribe({
          next: (message) => {
            this.protectedMessage = message;
            this.apiLoading = false;
          },
          error: () => {
            this.protectedMessage = 'Nie udało się pobrać komunikatu z serwera.';
            this.apiLoading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Sesja wygasła lub token jest nieważny. Zaloguj się ponownie.';
      },
    });
  }

  get initials(): string {
    const name = this.user?.username?.trim();
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    return this.user?.role?.replace('ROLE_', '') ?? 'USER';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Cześć';
    return 'Dobry wieczór';
  }

  get todayLabel(): string {
    return new Date().toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
