import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        <div class="text-center space-y-1">
          <div class="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl mx-auto shadow-md shadow-orange-500/20 mb-3">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 font-heading">Create CraveBite Account</h2>
          <p class="text-xs text-slate-500">Sign up and get \$5 off your first food order</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="e.g. John Doe"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="name@example.com"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              [(ngModel)]="phone"
              name="phone"
              placeholder="+1 555-0142"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Password (Min 6 chars) *</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
            <select
              [(ngModel)]="role"
              name="role"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option value="customer">Customer (Food Explorer)</option>
              <option value="restaurant">Restaurant Partner</option>
            </select>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition hover:scale-[1.01]">
            <span *ngIf="!loading">Complete Registration</span>
            <span *ngIf="loading"><i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Registering...</span>
          </button>
        </form>

        <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?
          <a routerLink="/login" class="font-bold text-orange-600 hover:text-orange-700 ml-1">Sign In</a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  role = 'customer';
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please provide name, email, and password.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      }
    });
  }
}
