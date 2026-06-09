import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Hasła nie są identyczne!';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Rejestracja zakończona sukcesem! Możesz się teraz zalogować.';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error =
          err.error?.message || 'Błąd podczas rejestracji. Spróbuj innej nazwy użytkownika.';
        this.success = '';
      },
    });
  }
}
