import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Your Past Orders</h1>
        <p class="text-xs text-slate-500 mt-1">Review your recent delicious culinary experiences</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-3">
          <div class="h-5 bg-slate-200 rounded w-1/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && orders.length === 0" class="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
        <div class="w-16 h-16 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4">
          <i class="fa-solid fa-receipt"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900 font-heading">No past orders yet</h3>
        <p class="text-xs text-slate-500 mt-1 mb-6">When you place orders, they will appear right here for live tracking and receipts.</p>
        <a routerLink="/restaurants" class="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition">
          Find Restaurants
        </a>
      </div>

      <!-- Orders List -->
      <div *ngIf="!loading && orders.length > 0" class="space-y-6">
        <div
          *ngFor="let o of orders"
          class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <!-- Restaurant & Info -->
          <div class="flex items-start space-x-4">
            <img
              [src]="o.restaurant?.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150'"
              [alt]="o.restaurant?.name"
              class="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0">
            
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-base font-bold text-slate-900">{{ o.restaurant?.name || 'Restaurant' }}</h3>
                <span
                  [ngClass]="getStatusBadgeClass(o.status)"
                  class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                  {{ o.status }}
                </span>
              </div>

              <p class="text-xs text-slate-400 mt-1">Placed on {{ o.createdAt | date:'mediumDate' }} at {{ o.createdAt | date:'shortTime' }}</p>

              <!-- Items snippet -->
              <p class="text-xs text-slate-600 mt-2 line-clamp-1">
                <span *ngFor="let itm of o.items; let last = last">
                  {{ itm.quantity }}x {{ itm.name }}{{ last ? '' : ', ' }}
                </span>
              </p>
            </div>
          </div>

          <!-- Price & Action CTA -->
          <div class="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div class="text-left md:text-right">
              <span class="text-xs text-slate-400">Total Bill</span>
              <p class="text-base font-extrabold text-slate-900">\${{ o.totalAmount.toFixed(2) }}</p>
            </div>

            <a
              [routerLink]="['/orders', o._id, 'track']"
              class="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-2 shadow-sm">
              <i class="fa-solid fa-map-location-dot"></i>
              <span>{{ o.status === 'Delivered' ? 'View Details' : 'Track Order' }}</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: res => {
        this.orders = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-700';
      case 'Preparing':
        return 'bg-amber-100 text-amber-700';
      case 'Confirmed':
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
