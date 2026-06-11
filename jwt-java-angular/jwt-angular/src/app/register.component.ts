import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, getApiErrorMessage, isUserAlreadyExistsError } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  error = '';
  success = '';
  userAlreadyExists = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister() {
    this.error = '';
    this.success = '';
    this.userAlreadyExists = false;

    if (!this.username.trim() || !this.password || !this.confirmPassword) {
      this.error = 'Wypełnij wszystkie pola.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Hasła nie są identyczne.';
      return;
    }

    this.loading = true;

    this.authService.register(this.username.trim(), this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response.message || 'Konto zostało utworzone pomyślnie!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.userAlreadyExists = isUserAlreadyExistsError(err);
        this.error = getApiErrorMessage(
          err,
          'Nie udało się utworzyć konta. Spróbuj ponownie.',
        );
      },
    });
  }
}
