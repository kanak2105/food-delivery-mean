import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Top Title & Search bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Restaurants Near You</h1>
          <p class="text-xs text-slate-500 mt-1">Discover {{ restaurants.length }} restaurants delivering right now</p>
        </div>

        <div class="flex items-center space-x-3 w-full md:w-auto">
          <!-- Search Input -->
          <div class="relative flex-1 md:w-72">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              [(ngModel)]="search"
              (input)="applyFilters()"
              placeholder="Search by restaurant or dish..."
              class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
            />
          </div>

          <!-- Sort Dropdown -->
          <select
            [(ngModel)]="sortBy"
            (change)="applyFilters()"
            class="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm cursor-pointer">
            <option value="featured">Sort: Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
            <option value="deliveryFee">Lowest Delivery Fee</option>
          </select>
        </div>
      </div>

      <!-- Cuisine Horizontal Filter Badges -->
      <div class="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <button
          *ngFor="let c of availableCuisines"
          (click)="selectCuisine(c)"
          [ngClass]="selectedCuisine === c ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
          class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition">
          {{ c }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse space-y-4">
          <div class="bg-slate-200 h-44 rounded-xl"></div>
          <div class="bg-slate-200 h-4 rounded w-2/3"></div>
          <div class="bg-slate-200 h-4 rounded w-1/3"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && restaurants.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
        <div class="w-16 h-16 mx-auto rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-2xl mb-4">
          <i class="fa-solid fa-utensils"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900 font-heading">No restaurants found</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">We couldn't find any restaurants matching your current search or filters.</p>
        <button (click)="resetFilters()" class="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
          Clear Filters
        </button>
      </div>

      <!-- Restaurants Grid -->
      <div *ngIf="!loading && restaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let res of restaurants"
          [routerLink]="['/restaurants', res._id]"
          class="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all cursor-pointer food-card-hover group flex flex-col">
          
          <!-- Banner -->
          <div class="relative h-44 overflow-hidden">
            <img [src]="res.bannerImage" [alt]="res.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Time Badge -->
            <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow">
              <i class="fa-regular fa-clock text-orange-500"></i>
              <span>{{ res.deliveryTimeMinutes }} mins</span>
            </div>

            <!-- Rating Badge -->
            <div class="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow">
              <i class="fa-solid fa-star text-[10px]"></i>
              <span>{{ res.rating }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">{{ res.name }}</h3>
              <p class="text-xs text-slate-500 line-clamp-1 mt-1">{{ res.cuisine.join(' • ') }}</p>
              <p class="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{{ res.description }}</p>
            </div>

            <div class="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span class="flex items-center space-x-1 font-semibold text-slate-700">
                <i class="fa-solid fa-truck text-orange-500 text-[11px]"></i>
                <span>\${{ res.deliveryFee }}</span>
              </span>
              <span>Min \${{ res.minimumOrder }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class RestaurantListComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private route = inject(ActivatedRoute);

  restaurants: Restaurant[] = [];
  loading = true;
  search = '';
  selectedCuisine = 'All';
  sortBy = 'featured';

  availableCuisines = ['All', 'Burgers', 'Pizza', 'Asian', 'Indian', 'Salads', 'Desserts', 'Beverages'];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.search = params['search'];
      if (params['cuisine']) this.selectedCuisine = params['cuisine'];
      this.fetchRestaurants();
    });
  }

  fetchRestaurants(): void {
    this.loading = true;
    this.restaurantService
      .getRestaurants({
        search: this.search,
        cuisine: this.selectedCuisine,
        sort: this.sortBy
      })
      .subscribe({
        next: res => {
          this.restaurants = res.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.fetchRestaurants();
  }

  selectCuisine(cuisine: string): void {
    this.selectedCuisine = cuisine;
    this.fetchRestaurants();
  }

  resetFilters(): void {
    this.search = '';
    this.selectedCuisine = 'All';
    this.sortBy = 'featured';
    this.fetchRestaurants();
  }
}
