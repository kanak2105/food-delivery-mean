import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Secure Checkout</h1>
        <p class="text-xs text-slate-500 mt-1">Review your delivery address and payment method</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Address & Payment Selection -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Delivery Address Section -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div class="flex items-center space-x-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
              <span class="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              <h2 class="text-base font-bold font-heading">1. Delivery Address</h2>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  [(ngModel)]="address.street"
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    [(ngModel)]="address.city"
                    placeholder="e.g. San Francisco"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    [(ngModel)]="address.postalCode"
                    placeholder="e.g. 94103"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="text"
                  [(ngModel)]="address.phone"
                  placeholder="e.g. +1 555-0142"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  [(ngModel)]="address.instructions"
                  placeholder="e.g. Ring the bell, leave at front door"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div class="flex items-center space-x-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-credit-card"></i>
              </span>
              <h2 class="text-base font-bold font-heading">2. Payment Method</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                (click)="paymentMethod = 'Credit/Debit Card'"
                [ngClass]="paymentMethod === 'Credit/Debit Card' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' : 'border-slate-200 bg-white'"
                class="border rounded-2xl p-4 cursor-pointer text-center transition">
                <i class="fa-solid fa-credit-card text-lg text-slate-700 mb-2"></i>
                <h4 class="text-xs font-bold text-slate-800">Card</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Visa / Mastercard</p>
              </div>

              <div
                (click)="paymentMethod = 'UPI / NetBanking'"
                [ngClass]="paymentMethod === 'UPI / NetBanking' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' : 'border-slate-200 bg-white'"
                class="border rounded-2xl p-4 cursor-pointer text-center transition">
                <i class="fa-solid fa-mobile-screen-button text-lg text-slate-700 mb-2"></i>
                <h4 class="text-xs font-bold text-slate-800">UPI / QR</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Instant Transfer</p>
              </div>

              <div
                (click)="paymentMethod = 'Cash on Delivery'"
                [ngClass]="paymentMethod === 'Cash on Delivery' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' : 'border-slate-200 bg-white'"
                class="border rounded-2xl p-4 cursor-pointer text-center transition">
                <i class="fa-solid fa-money-bill-wave text-lg text-slate-700 mb-2"></i>
                <h4 class="text-xs font-bold text-slate-800">Cash / COD</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Pay on Delivery</p>
              </div>
            </div>

            <!-- Mock Card Inputs if Card chosen -->
            <div *ngIf="paymentMethod === 'Credit/Debit Card'" class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 mt-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                <input type="text" placeholder="•••• •••• •••• 4242" value="4242 •••• •••• 4242" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Expires</label>
                  <input type="text" placeholder="MM/YY" value="12/28" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">CVC</label>
                  <input type="password" placeholder="•••" value="123" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800">
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Right Side: Order Summary & Place Order CTA -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Order Summary</h2>

          <div class="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            <div *ngFor="let item of cartService.cartItems$ | async" class="py-2.5 flex justify-between items-center text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-bold text-orange-600">{{ item.quantity }}x</span>
                <span class="font-semibold text-slate-800">{{ item.foodItem.name }}</span>
              </div>
              <span class="font-bold text-slate-700">\${{ (item.foodItem.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-slate-800">\${{ (cartService.subtotal$ | async)?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span class="font-bold text-slate-800">\${{ (cartService.activeRestaurant?.deliveryFee || 2.99).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax (5%)</span>
              <span class="font-bold text-slate-800">\${{ (cartService.tax$ | async)?.toFixed(2) }}</span>
            </div>
            <div class="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span class="text-orange-600">\${{ (cartService.totalAmount$ | async)?.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
            {{ errorMessage }}
          </div>

          <!-- Place Order Button -->
          <button
            (click)="submitOrder()"
            [disabled]="isPlacingOrder"
            class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition hover:scale-[1.01]">
            <span *ngIf="!isPlacingOrder">Confirm & Place Order</span>
            <span *ngIf="isPlacingOrder" class="flex items-center space-x-2">
              <i class="fa-solid fa-circle-notch fa-spin"></i>
              <span>Processing Order...</span>
            </span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  private router = inject(Router);

  address = {
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    instructions: ''
  };

  paymentMethod = 'Credit/Debit Card';
  isPlacingOrder = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartService.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const user = this.authService.currentUserValue;
    if (user?.addresses && user.addresses.length > 0) {
      const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
      this.address.street = def.street;
      this.address.city = def.city;
      this.address.postalCode = def.postalCode;
    }
    if (user?.phone) {
      this.address.phone = user.phone;
    }
  }

  submitOrder(): void {
    if (!this.address.street || !this.address.city || !this.address.phone) {
      this.errorMessage = 'Please complete all required delivery address fields.';
      return;
    }

    this.isPlacingOrder = true;
    this.errorMessage = '';

    const payload = {
      restaurantId: this.cartService.activeRestaurant!.id,
      items: this.cartService.items.map(i => ({
        foodItemId: i.foodItem._id,
        quantity: i.quantity
      })),
      deliveryAddress: this.address,
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(payload).subscribe({
      next: res => {
        this.cartService.clearCart();
        this.isPlacingOrder = false;
        this.router.navigate(['/orders', res.data._id, 'track']);
      },
      error: err => {
        this.isPlacingOrder = false;
        this.errorMessage = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}
