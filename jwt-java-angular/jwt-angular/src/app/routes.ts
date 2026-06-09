import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
