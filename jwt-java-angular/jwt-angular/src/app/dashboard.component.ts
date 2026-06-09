// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  message = 'Ładowanie...';
  username = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProtectedData();
  }

  loadProtectedData() {
    this.http.get('http://localhost:8080/api/hello', { responseType: 'text' }).subscribe({
      next: (res) => (this.message = res),
      error: () => (this.message = 'Błąd pobierania danych (token nieważny?)'),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
