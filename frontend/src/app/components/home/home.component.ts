import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white overflow-hidden py-16 md:py-24">
        <!-- Background decorative circles -->
        <div class="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Headline -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <i class="fa-solid fa-bolt text-yellow-300"></i>
                <span>Super Fast Delivery in 30 Mins</span>
              </div>
              
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-tight tracking-tight">
                Delicious food delivered <br class="hidden sm:inline">to your doorstep.
              </h1>
              
              <p class="text-base sm:text-lg text-orange-100 max-w-xl mx-auto lg:mx-0">
                Explore hundreds of gourmet restaurants, freshly cooked dishes, and artisan treats crafted with passion.
              </p>

              <!-- Search Bar -->
              <div class="bg-white p-2 rounded-2xl shadow-xl max-w-xl mx-auto lg:mx-0 flex items-center space-x-2">
                <div class="flex-1 flex items-center pl-3 space-x-2 text-slate-400">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (keyup.enter)="onSearch()"
                    placeholder="Search restaurant, burger, pizza, biryani..."
                    class="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  (click)="onSearch()"
                  class="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow shadow-orange-600/30 flex items-center space-x-2">
                  <span>Search</span>
                </button>
              </div>

              <!-- Quick stats -->
              <div class="flex items-center justify-center lg:justify-start space-x-8 pt-4 text-xs font-semibold text-orange-100">
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-store text-yellow-300"></i>
                  <span>500+ Top Restaurants</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-motorcycle text-yellow-300"></i>
                  <span>Zero Contact Delivery</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-star text-yellow-300"></i>
                  <span>4.9 Customer Rating</span>
                </div>
              </div>
            </div>

            <!-- Right Visual Graphic -->
            <div class="lg:col-span-5 relative flex justify-center">
              <div class="relative w-72 sm:w-88 sm:h-88 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-1 hover:rotate-0 transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious food spread"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div class="text-left text-white">
                    <span class="bg-orange-500 text-xs font-extrabold uppercase px-2.5 py-1 rounded-md">Trending Now</span>
                    <h3 class="text-xl font-bold font-heading mt-2">Gourmet Truffle Burgers</h3>
                    <p class="text-xs text-slate-200">Starting from $12.99</p>
                  </div>
                </div>
              </div>

              <!-- Floating badge 1 -->
              <div class="absolute -top-4 left-4 bg-white text-slate-800 p-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold animate-bounce">
                <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
                  <i class="fa-solid fa-percent"></i>
                </span>
                <div>
                  <p class="text-slate-500 text-[10px]">Special Discount</p>
                  <p class="font-extrabold text-slate-900">50% OFF 1st Order</p>
                </div>
              </div>

              <!-- Floating badge 2 -->
              <div class="absolute -bottom-4 right-4 bg-white text-slate-800 p-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold">
                <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                  <i class="fa-solid fa-clock"></i>
                </span>
                <div>
                  <p class="text-slate-500 text-[10px]">Average Speed</p>
                  <p class="font-extrabold text-slate-900">22 Mins Delivery</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">What's on your mind?</h2>
            <p class="text-sm text-slate-500 mt-1">Select from our hand-picked food categories</p>
          </div>
          <a routerLink="/restaurants" class="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1">
            <span>View All</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div
            *ngFor="let cat of categories"
            (click)="selectCategory(cat.name)"
            class="bg-white border border-slate-100 hover:border-orange-300 p-4 rounded-2xl text-center cursor-pointer shadow-sm hover:shadow-md transition group food-card-hover">
            <div class="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 ring-2 ring-slate-100 group-hover:ring-orange-500/40 transition">
              <img [src]="cat.image" [alt]="cat.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
            </div>
            <h4 class="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition">{{ cat.name }}</h4>
          </div>
        </div>
      </section>

      <!-- Featured Restaurants -->
      <section class="bg-slate-100/60 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-8">
            <div>
              <div class="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <i class="fa-solid fa-fire"></i>
                <span>Top Rated</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Featured Restaurants</h2>
            </div>
            <a routerLink="/restaurants" class="text-sm font-bold text-orange-600 hover:text-orange-700">Explore All &rarr;</a>
          </div>

          <!-- Loading skeleton -->
          <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div *ngFor="let i of [1,2,3]" class="bg-white rounded-2xl p-4 animate-pulse space-y-4 shadow-sm">
              <div class="bg-slate-200 h-48 rounded-xl"></div>
              <div class="bg-slate-200 h-4 rounded w-3/4"></div>
              <div class="bg-slate-200 h-4 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Restaurant Cards Grid -->
          <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              *ngFor="let res of featuredRestaurants"
              [routerLink]="['/restaurants', res._id]"
              class="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all cursor-pointer food-card-hover group flex flex-col">
              
              <!-- Banner Image -->
              <div class="relative h-48 overflow-hidden">
                <img
                  [src]="res.bannerImage"
                  [alt]="res.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <!-- Delivery Time Badge -->
                <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center space-x-1.5 shadow">
                  <i class="fa-regular fa-clock text-orange-500"></i>
                  <span>{{ res.deliveryTimeMinutes }} mins</span>
                </div>

                <!-- Rating Badge -->
                <div class="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow">
                  <i class="fa-solid fa-star text-[10px]"></i>
                  <span>{{ res.rating }}</span>
                </div>
              </div>

              <!-- Body -->
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition">{{ res.name }}</h3>
                  </div>
                  
                  <p class="text-xs text-slate-500 line-clamp-1 mb-3">{{ res.cuisine.join(' • ') }}</p>
                  
                  <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {{ res.description }}
                  </p>
                </div>

                <div class="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div class="flex items-center space-x-1">
                    <i class="fa-solid fa-bicycle text-orange-500"></i>
                    <span>\${{ res.deliveryFee }} Delivery</span>
                  </div>
                  <div>
                    <span>Min. \${{ res.minimumOrder }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose CraveBite Features -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-3xl font-extrabold text-slate-900 font-heading">Why Foodies Love CraveBite</h2>
          <p class="text-sm text-slate-500 mt-2">Experience seamless online food ordering powered by cutting-edge MEAN stack engineering.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-heading">Superfast Delivery</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Our automated logistics dispatch the nearest driver the moment your meal is packed hot from the kitchen.
            </p>
          </div>

          <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-heading">Live Order Tracking</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Stay in the loop with live step-by-step order progress timeline from kitchen to your front doorstep.
            </p>
          </div>

          <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-heading">Hygienic & Certified</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Every partner restaurant maintains the highest hygiene protocols with tamper-evident packaging.
            </p>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private router = inject(Router);

  searchQuery = '';
  loading = true;
  featuredRestaurants: Restaurant[] = [];

  categories = [
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80' },
    { name: 'Asian', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80' },
    { name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80' }
  ];

  ngOnInit(): void {
    this.fetchFeaturedRestaurants();
  }

  fetchFeaturedRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: res => {
        this.featuredRestaurants = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/restaurants'], {
        queryParams: { search: this.searchQuery.trim() }
      });
    }
  }

  selectCategory(categoryName: string): void {
    this.router.navigate(['/restaurants'], {
      queryParams: { cuisine: categoryName }
    });
  }
}
