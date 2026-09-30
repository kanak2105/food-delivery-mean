import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { Restaurant, FoodItem } from '../../models';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
      <div class="h-64 bg-slate-200 rounded-3xl"></div>
      <div class="h-10 bg-slate-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let i of [1,2,3,4]" class="h-40 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>

    <div *ngIf="!loading && restaurant" class="pb-24">
      
      <!-- Restaurant Header Banner -->
      <div class="relative h-64 md:h-80 w-full overflow-hidden">
        <img [src]="restaurant.bannerImage" [alt]="restaurant.name" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 flex items-end pb-8">
          <div class="flex flex-col sm:flex-row sm:items-end gap-6 text-white w-full">
            <img [src]="restaurant.logo" [alt]="restaurant.name" class="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl">
            
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span *ngIf="restaurant.isOpen" class="bg-emerald-500/90 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Open Now</span>
                <span class="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">{{ restaurant.cuisine.join(', ') }}</span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold font-heading mt-1 text-white">{{ restaurant.name }}</h1>
              <p class="text-xs text-slate-200 mt-1 max-w-xl">{{ restaurant.description }}</p>
              
              <div class="flex flex-wrap items-center gap-4 mt-3 text-xs font-semibold">
                <span class="flex items-center space-x-1 bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <i class="fa-solid fa-star text-amber-400"></i>
                  <span>{{ restaurant.rating }} ({{ restaurant.totalReviews }}+ reviews)</span>
                </span>
                <span class="flex items-center space-x-1 bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <i class="fa-regular fa-clock text-orange-300"></i>
                  <span>{{ restaurant.deliveryTimeMinutes }} mins delivery</span>
                </span>
                <span class="flex items-center space-x-1 bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <i class="fa-solid fa-truck text-orange-300"></i>
                  <span>\${{ restaurant.deliveryFee }} delivery fee</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter Sticky Bar -->
      <div class="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-3 overflow-x-auto py-3.5 scrollbar-none">
          <button
            *ngFor="let cat of categories"
            (click)="scrollToCategory(cat)"
            class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-slate-100 hover:bg-orange-100 hover:text-orange-600 text-slate-700 transition">
            {{ cat }} ({{ menuByCategory[cat]?.length || 0 }})
          </button>
        </div>
      </div>

      <!-- Menu Categories & Food Items Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div *ngFor="let cat of categories" [id]="'cat-' + cat" class="space-y-4">
          <div class="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <h2 class="text-xl font-extrabold text-slate-900 font-heading">{{ cat }}</h2>
            <span class="text-xs font-bold text-slate-400">({{ menuByCategory[cat].length }})</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              *ngFor="let item of menuByCategory[cat]"
              class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition flex justify-between gap-4 food-card-hover">
              
              <!-- Dish Details -->
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center space-x-2 mb-1.5">
                    <!-- Veg / Non-Veg Icon -->
                    <span
                      [class]="item.isVeg ? 'badge-veg' : 'badge-non-veg'"
                      class="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold">
                      <i class="fa-solid fa-circle"></i>
                    </span>
                    <span *ngIf="item.isSpicy" class="text-red-500 text-xs" title="Spicy"><i class="fa-solid fa-pepper-hot"></i></span>
                    <span *ngIf="item.calories" class="text-[10px] text-slate-400 font-semibold">{{ item.calories }} kcal</span>
                  </div>

                  <h3 class="text-base font-bold text-slate-900">{{ item.name }}</h3>
                  <p class="text-sm font-extrabold text-slate-800 mt-1">\${{ item.price.toFixed(2) }}</p>
                  <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{{ item.description }}</p>
                </div>

                <div class="mt-4 flex items-center space-x-2 text-xs text-slate-400">
                  <i class="fa-solid fa-clock"></i>
                  <span>Prep ~{{ item.preparationTimeMinutes || 20 }} mins</span>
                </div>
              </div>

              <!-- Dish Image & Cart Action -->
              <div class="relative flex flex-col items-center justify-center w-32 shrink-0">
                <div class="w-32 h-28 rounded-2xl overflow-hidden shadow-inner">
                  <img [src]="item.image" [alt]="item.name" class="w-full h-full object-cover">
                </div>

                <!-- Add Button or Quantity Controller -->
                <div class="-mt-4 relative z-10">
                  <ng-container *ngIf="getItemQuantity(item._id) === 0; else qtyController">
                    <button
                      (click)="onAddToCart(item)"
                      class="bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 font-extrabold text-xs px-5 py-2 rounded-xl shadow-md uppercase tracking-wider transition hover:scale-105">
                      ADD +
                    </button>
                  </ng-container>

                  <ng-template #qtyController>
                    <div class="flex items-center bg-orange-600 text-white rounded-xl shadow-md text-xs font-bold overflow-hidden">
                      <button (click)="updateQuantity(item._id, -1)" class="px-2.5 py-1.5 hover:bg-orange-700 transition">
                        <i class="fa-solid fa-minus text-[10px]"></i>
                      </button>
                      <span class="px-2.5 py-1.5 min-w-[24px] text-center">{{ getItemQuantity(item._id) }}</span>
                      <button (click)="updateQuantity(item._id, 1)" class="px-2.5 py-1.5 hover:bg-orange-700 transition">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                      </button>
                    </div>
                  </ng-template>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Restaurant Conflict Reset Modal -->
      <div *ngIf="showConflictModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl mx-auto">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 font-heading">Replace cart items?</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Your cart contains items from <strong>{{ cartService.activeRestaurant?.name }}</strong>. Would you like to clear your cart and start fresh with <strong>{{ restaurant.name }}</strong>?
          </p>
          <div class="flex items-center space-x-3 pt-2">
            <button (click)="showConflictModal = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition">
              Cancel
            </button>
            <button (click)="confirmResetAndAdd()" class="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-md shadow-orange-600/30">
              Clear & Add
            </button>
          </div>
        </div>
      </div>

      <!-- Sticky Floating Bottom Cart Bar -->
      <div *ngIf="(cartService.totalCount$ | async) as count" class="fixed bottom-4 inset-x-0 z-40 max-w-xl mx-auto px-4">
        <a routerLink="/cart" class="bg-slate-900 hover:bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between transition transform hover:-translate-y-0.5">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-extrabold text-xs">
              {{ count }}
            </span>
            <div>
              <p class="text-xs text-slate-300">Total: <strong class="text-white">\${{ (cartService.totalAmount$ | async)?.toFixed(2) }}</strong></p>
              <p class="text-[10px] text-orange-400 font-semibold">{{ cartService.activeRestaurant?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-xs font-bold text-orange-400">
            <span>View Cart</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>
      </div>

    </div>
  `
})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);
  cartService = inject(CartService);

  restaurant: Restaurant | null = null;
  menuByCategory: { [category: string]: FoodItem[] } = {};
  categories: string[] = [];
  loading = true;

  showConflictModal = false;
  pendingItemToAdd: FoodItem | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRestaurant(id);
    }
  }

  fetchRestaurant(id: string): void {
    this.loading = true;
    this.restaurantService.getRestaurantById(id).subscribe({
      next: res => {
        this.restaurant = res.data.restaurant;
        this.menuByCategory = res.data.menuByCategory;
        this.categories = Object.keys(this.menuByCategory);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  scrollToCategory(category: string): void {
    const el = document.getElementById('cat-' + category);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getItemQuantity(foodId: string): number {
    const item = this.cartService.items.find(i => i.foodItem._id === foodId);
    return item ? item.quantity : 0;
  }

  onAddToCart(item: FoodItem): void {
    if (!this.restaurant) return;
    const result = this.cartService.addToCart(item, this.restaurant);
    if (result.requiresReset) {
      this.pendingItemToAdd = item;
      this.showConflictModal = true;
    }
  }

  updateQuantity(foodId: string, change: number): void {
    this.cartService.updateQuantity(foodId, change);
  }

  confirmResetAndAdd(): void {
    this.cartService.clearCart();
    if (this.pendingItemToAdd && this.restaurant) {
      this.cartService.addToCart(this.pendingItemToAdd, this.restaurant);
    }
    this.showConflictModal = false;
    this.pendingItemToAdd = null;
  }
}
