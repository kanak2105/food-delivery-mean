import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        
        <div class="text-center space-y-1">
          <div class="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl mx-auto shadow-md shadow-orange-500/20 mb-3">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 font-heading">Welcome Back</h2>
          <p class="text-xs text-slate-500">Sign in to track orders, saved addresses, and faster checkout</p>
        </div>

        <!-- Quick Demo One-Click Fill -->
        <div class="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3.5 text-xs text-slate-700">
          <p class="font-bold text-orange-900 mb-2 flex items-center space-x-1.5">
            <i class="fa-solid fa-key text-orange-600"></i>
            <span>Quick Demo Auto-Fill:</span>
          </p>
          <div class="flex items-center space-x-2">
            <button
              type="button"
              (click)="fillDemo('customer')"
              class="flex-1 bg-white hover:bg-orange-100 text-orange-700 border border-orange-300 font-bold py-1.5 px-2 rounded-lg text-[11px] transition shadow-xs">
              Customer Account
            </button>
            <button
              type="button"
              (click)="fillDemo('admin')"
              class="flex-1 bg-white hover:bg-purple-100 text-purple-700 border border-purple-300 font-bold py-1.5 px-2 rounded-lg text-[11px] transition shadow-xs">
              Admin Account
            </button>
          </div>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div class="relative">
              <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="name@example.com"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition hover:scale-[1.01]">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading"><i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Authenticating...</span>
          </button>
        </form>

        <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?
          <a routerLink="/register" class="font-bold text-orange-600 hover:text-orange-700 ml-1">Create Account</a>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  returnUrl = '/';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  fillDemo(type: 'customer' | 'admin'): void {
    if (type === 'customer') {
      this.email = 'john@example.com';
      this.password = 'password123';
    } else {
      this.email = 'admin@foodie.com';
      this.password = 'password123';
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check credentials.';
      }
    });
  }
}
