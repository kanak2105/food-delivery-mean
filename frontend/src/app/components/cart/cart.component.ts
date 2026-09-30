import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Your Food Cart</h1>
        <p *ngIf="cartService.activeRestaurant" class="text-xs text-slate-500 mt-1">
          Ordering from: <strong class="text-slate-800">{{ cartService.activeRestaurant.name }}</strong>
        </p>
      </div>

      <!-- Empty Cart State -->
      <div *ngIf="(cartService.cartItems$ | async)?.length === 0" class="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
        <div class="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-4">
          <i class="fa-solid fa-basket-shopping"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-900 font-heading">Your cart is empty</h3>
        <p class="text-xs text-slate-500 mt-2 mb-6">Looks like you haven't added any appetizing dishes to your cart yet.</p>
        <a routerLink="/restaurants" class="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-600/30 transition">
          Explore Restaurants
        </a>
      </div>

      <!-- Cart With Items -->
      <div *ngIf="((cartService.cartItems$ | async)?.length || 0) > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Items List -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 class="text-base font-bold text-slate-900">Items Selected</h2>
            <button (click)="clearCart()" class="text-xs font-semibold text-red-500 hover:text-red-700">Clear Cart</button>
          </div>

          <div class="divide-y divide-slate-100">
            <div *ngFor="let item of cartService.cartItems$ | async" class="py-4 flex items-center justify-between gap-4">
              <div class="flex items-center space-x-3 flex-1">
                <img [src]="item.foodItem.image" [alt]="item.foodItem.name" class="w-16 h-16 rounded-xl object-cover shrink-0">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">{{ item.foodItem.name }}</h4>
                  <p class="text-xs text-slate-400">\${{ item.foodItem.price.toFixed(2) }} each</p>
                  <p class="text-xs font-extrabold text-orange-600 mt-0.5">\${{ (item.foodItem.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2">
                <div class="flex items-center bg-slate-100 rounded-xl overflow-hidden text-xs font-bold text-slate-700">
                  <button (click)="updateQuantity(item.foodItem._id, -1)" class="px-2.5 py-1.5 hover:bg-slate-200 transition">
                    <i class="fa-solid fa-minus text-[10px]"></i>
                  </button>
                  <span class="px-2.5 py-1.5 min-w-[24px] text-center">{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item.foodItem._id, 1)" class="px-2.5 py-1.5 hover:bg-slate-200 transition">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                  </button>
                </div>

                <button (click)="removeItem(item.foodItem._id)" class="text-slate-400 hover:text-red-500 p-1.5 text-xs transition" title="Remove">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <a [routerLink]="['/restaurants', cartService.activeRestaurant?.id]" class="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1">
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Add more items from this restaurant</span>
            </a>
          </div>
        </div>

        <!-- Bill Details Summary -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Bill Summary</h2>

          <!-- Promo Code -->
          <div class="flex space-x-2">
            <input
              type="text"
              [(ngModel)]="promoCode"
              placeholder="Promo Code (e.g. SAVE20)"
              class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              (click)="applyPromo()"
              class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
              Apply
            </button>
          </div>
          <p *ngIf="promoSuccess" class="text-xs font-bold text-emerald-600 -mt-4">
            <i class="fa-solid fa-check-circle mr-1"></i> Coupon applied: \$5.00 OFF!
          </p>

          <!-- Calculations Breakdown -->
          <div class="space-y-3 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Item Subtotal</span>
              <span class="font-bold text-slate-800">\${{ (cartService.subtotal$ | async)?.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span class="font-bold text-slate-800">\${{ (cartService.activeRestaurant?.deliveryFee || 2.99).toFixed(2) }}</span>
            </div>

            <div class="flex justify-between">
              <span>GST & Restaurant Taxes (5%)</span>
              <span class="font-bold text-slate-800">\${{ (cartService.tax$ | async)?.toFixed(2) }}</span>
            </div>

            <div *ngIf="discount > 0" class="flex justify-between text-emerald-600 font-bold">
              <span>Promo Discount</span>
              <span>-\${{ discount.toFixed(2) }}</span>
            </div>

            <div class="border-t border-slate-200 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
              <span>To Pay</span>
              <span class="text-orange-600">\${{ getFinalTotal().toFixed(2) }}</span>
            </div>
          </div>

          <!-- Checkout CTA -->
          <button
            (click)="proceedToCheckout()"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition hover:scale-[1.01]">
            <span>Proceed to Checkout</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>

      </div>

    </div>
  `
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);

  promoCode = '';
  promoSuccess = false;
  discount = 0;

  updateQuantity(id: string, change: number): void {
    this.cartService.updateQuantity(id, change);
  }

  removeItem(id: string): void {
    this.cartService.removeItem(id);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.discount = 0;
    this.promoSuccess = false;
  }

  applyPromo(): void {
    if (this.promoCode.trim().toUpperCase() === 'SAVE20' || this.promoCode.trim().toUpperCase() === 'WELCOME50') {
      this.discount = 5.0;
      this.promoSuccess = true;
    } else {
      alert('Invalid promo code. Try "SAVE20"');
    }
  }

  getFinalTotal(): number {
    let sub = 0;
    this.cartService.subtotal$.subscribe(v => (sub = v));
    if (sub === 0) return 0;
    const fee = this.cartService.activeRestaurant?.deliveryFee || 2.99;
    const tax = Number((sub * 0.05).toFixed(2));
    const total = sub + fee + tax - this.discount;
    return Math.max(0, Number(total.toFixed(2)));
  }

  proceedToCheckout(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}
