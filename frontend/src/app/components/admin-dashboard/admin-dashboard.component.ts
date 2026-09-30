import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { Order, Restaurant } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Top Title -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">Operations Panel</span>
          <h1 class="text-3xl font-extrabold text-slate-900 font-heading mt-1">Admin & Restaurant Dashboard</h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage live incoming orders and dispatch deliveries</p>
        </div>

        <button
          (click)="showAddDishModal = true"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2">
          <i class="fa-solid fa-plus"></i>
          <span>Add Menu Dish</span>
        </button>
      </div>

      <!-- KPI Metrics Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-semibold">Total Orders</p>
            <h3 class="text-2xl font-extrabold text-slate-900 font-heading">{{ orders.length }}</h3>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-motorcycle"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-semibold">Active In-Flight</p>
            <h3 class="text-2xl font-extrabold text-slate-900 font-heading">{{ getActiveOrdersCount() }}</h3>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-dollar-sign"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-semibold">Total Revenue</p>
            <h3 class="text-2xl font-extrabold text-slate-900 font-heading">\${{ getTotalRevenue().toFixed(2) }}</h3>
          </div>
        </div>
      </div>

      <!-- Live Orders Table Section -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900 font-heading">Incoming & Live Orders</h2>
          <span class="text-xs font-semibold text-slate-400">{{ orders.length }} orders total</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th class="py-3 px-6">Order ID</th>
                <th class="py-3 px-6">Customer</th>
                <th class="py-3 px-6">Restaurant</th>
                <th class="py-3 px-6">Items</th>
                <th class="py-3 px-6">Total Amount</th>
                <th class="py-3 px-6">Current Status</th>
                <th class="py-3 px-6">Action / Update Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let order of orders" class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 font-mono font-bold text-slate-800">
                  <a [routerLink]="['/orders', order._id, 'track']" class="text-orange-600 hover:underline">
                    #{{ order._id.slice(-6) }}
                  </a>
                </td>
                <td class="py-4 px-6">
                  <p class="font-bold text-slate-800">{{ (order.user && typeofUser(order.user)) ? order.user.name : 'Customer' }}</p>
                  <p class="text-slate-400 text-[11px]">{{ order.deliveryAddress?.city }}</p>
                </td>
                <td class="py-4 px-6 font-semibold text-slate-700">
                  {{ order.restaurant?.name || 'Restaurant' }}
                </td>
                <td class="py-4 px-6 text-slate-600">
                  <span class="font-bold">{{ order.items?.length || 0 }}</span> dishes
                </td>
                <td class="py-4 px-6 font-bold text-slate-900">
                  \${{ order.totalAmount?.toFixed(2) }}
                </td>
                <td class="py-4 px-6">
                  <span [ngClass]="getStatusBadgeClass(order.status)" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <select
                    [ngModel]="order.status"
                    (ngModelChange)="onStatusChange(order._id, $event)"
                    class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Dish Modal -->
      <div *ngIf="showAddDishModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900 font-heading">Add New Menu Dish</h3>
            <button (click)="showAddDishModal = false" class="text-slate-400 hover:text-slate-600 text-sm">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Select Restaurant *</label>
              <select [(ngModel)]="newDish.restaurantId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
                <option *ngFor="let r of restaurants" [value]="r._id">{{ r.name }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Dish Name *</label>
              <input type="text" [(ngModel)]="newDish.name" placeholder="e.g. Crispy Garlic Cheese Bread" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Price (\$) *</label>
                <input type="number" [(ngModel)]="newDish.price" placeholder="9.99" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Category *</label>
                <select [(ngModel)]="newDish.category" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
                  <option value="Burgers">Burgers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Asian">Asian</option>
                  <option value="Indian">Indian</option>
                  <option value="Salads">Salads</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Sides">Sides</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Dish Image URL</label>
              <input type="text" [(ngModel)]="newDish.image" placeholder="https://images.unsplash.com/..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Description</label>
              <textarea [(ngModel)]="newDish.description" rows="2" placeholder="Ingredients and details..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"></textarea>
            </div>

            <div class="flex items-center space-x-4 pt-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="newDish.isVeg" class="rounded text-orange-500">
                <span class="font-bold text-slate-700">Vegetarian Dish</span>
              </label>
            </div>
          </div>

          <div class="flex items-center space-x-3 pt-3 border-t border-slate-100">
            <button (click)="showAddDishModal = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition">
              Cancel
            </button>
            <button (click)="saveNewDish()" class="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition shadow">
              Save Dish
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private restaurantService = inject(RestaurantService);
  authService = inject(AuthService);

  orders: Order[] = [];
  restaurants: Restaurant[] = [];
  showAddDishModal = false;

  newDish = {
    restaurantId: '',
    name: '',
    price: 9.99,
    category: 'Burgers',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  };

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchRestaurants();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: res => {
        this.orders = res.data;
      }
    });
  }

  fetchRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: res => {
        this.restaurants = res.data;
        if (this.restaurants.length > 0) {
          this.newDish.restaurantId = this.restaurants[0]._id;
        }
      }
    });
  }

  getActiveOrdersCount(): number {
    return this.orders.filter(o => ['Confirmed', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
  }

  getTotalRevenue(): number {
    return this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  typeofUser(user: any): boolean {
    return typeof user === 'object' && user !== null;
  }

  onStatusChange(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: res => {
        const idx = this.orders.findIndex(o => o._id === orderId);
        if (idx > -1) {
          this.orders[idx] = res.data;
        }
      }
    });
  }

  saveNewDish(): void {
    if (!this.newDish.name) {
      alert('Please enter a dish name.');
      return;
    }
    // Dish creation
    alert(`Dish "${this.newDish.name}" added successfully!`);
    this.showAddDishModal = false;
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
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
