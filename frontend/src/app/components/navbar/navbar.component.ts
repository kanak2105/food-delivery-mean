import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo & Location -->
        <div class="flex items-center space-x-8">
          <a routerLink="/" class="flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-slate-900 group">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-utensils"></i>
            </span>
            <span class="font-heading">Crave<span class="text-orange-500">Bite</span></span>
          </a>

          <!-- Location Indicator -->
          <div class="hidden md:flex items-center text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer">
            <i class="fa-solid fa-location-dot text-orange-500 mr-2"></i>
            <span>San Francisco, CA</span>
            <i class="fa-solid fa-chevron-down text-slate-400 text-[10px] ml-2"></i>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600">
          <a routerLink="/" routerLinkActive="text-orange-600" [routerLinkActiveOptions]="{exact: true}" class="hover:text-orange-600 transition">Home</a>
          <a routerLink="/restaurants" routerLinkActive="text-orange-600" class="hover:text-orange-600 transition">Restaurants</a>
          <a routerLink="/orders" *ngIf="authService.currentUser$ | async" routerLinkActive="text-orange-600" class="hover:text-orange-600 transition">My Orders</a>
          <a routerLink="/admin" *ngIf="(authService.currentUser$ | async)?.role === 'admin' || (authService.currentUser$ | async)?.role === 'restaurant'" class="text-purple-600 hover:text-purple-700 font-bold flex items-center space-x-1">
            <i class="fa-solid fa-gauge-high mr-1"></i> Dashboard
          </a>
        </nav>

        <!-- Right Side: Cart & User Auth -->
        <div class="flex items-center space-x-4">
          <!-- Cart Button -->
          <a routerLink="/cart" class="relative flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm transition group">
            <i class="fa-solid fa-bag-shopping text-base group-hover:scale-110 transition-transform"></i>
            <span class="hidden sm:inline">Cart</span>
            <span *ngIf="(cartService.totalCount$ | async) as count" class="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {{ count }}
            </span>
          </a>

          <!-- User Profile / Auth Links -->
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestTpl">
            <div class="relative group">
              <button class="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 focus:outline-none">
                <img [src]="user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'" alt="Avatar" class="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/30">
                <span class="hidden sm:inline">{{ user.name.split(' ')[0] }}</span>
                <i class="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 hidden group-hover:block hover:block z-50">
                <div class="px-4 py-2 border-b border-slate-100">
                  <p class="text-xs font-semibold text-slate-400">Signed in as</p>
                  <p class="text-sm font-bold text-slate-800 truncate">{{ user.email }}</p>
                  <span class="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold uppercase rounded bg-orange-100 text-orange-700">{{ user.role }}</span>
                </div>
                <a routerLink="/orders" class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-orange-600">
                  <i class="fa-solid fa-receipt mr-2 text-slate-400"></i> My Orders
                </a>
                <a routerLink="/admin" *ngIf="user.role === 'admin' || user.role === 'restaurant'" class="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
                  <i class="fa-solid fa-sliders mr-2"></i> Management
                </a>
                <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Sign Out
                </button>
              </div>
            </div>
          </ng-container>

          <ng-template #guestTpl>
            <div class="flex items-center space-x-2">
              <a routerLink="/login" class="text-sm font-bold text-slate-700 hover:text-orange-600 px-3 py-2 transition">Sign In</a>
              <a routerLink="/register" class="text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow transition">Sign Up</a>
            </div>
          </ng-template>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
