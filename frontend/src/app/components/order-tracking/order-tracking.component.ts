import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Top Success Alert -->
      <div class="bg-emerald-500 text-white rounded-3xl p-6 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <h2 class="text-xl font-extrabold font-heading">Order Placed & Confirmed!</h2>
            <p class="text-xs text-emerald-100 mt-0.5">Order ID: <span class="font-mono font-bold">{{ order?._id }}</span></p>
          </div>
        </div>

        <div class="text-center sm:text-right bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
          <p class="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Estimated Delivery</p>
          <p class="text-lg font-extrabold font-heading">25 - 35 Mins</p>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-3xl p-10 animate-pulse space-y-6 border border-slate-100">
        <div class="h-6 bg-slate-200 rounded w-1/3"></div>
        <div class="h-20 bg-slate-200 rounded-2xl"></div>
        <div class="h-40 bg-slate-200 rounded-2xl"></div>
      </div>

      <div *ngIf="!loading && order" class="space-y-8">
        
        <!-- Interactive Live Progress Timeline Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Live Status</span>
              <h3 class="text-2xl font-extrabold text-slate-900 font-heading mt-2">{{ getCurrentStatusTitle() }}</h3>
              <p class="text-xs text-slate-500 mt-1">{{ getCurrentStatusDescription() }}</p>
            </div>

            <!-- Demo Interactive Simulator Button -->
            <button
              (click)="advanceStatusForDemo()"
              [disabled]="order.status === 'Delivered'"
              class="hidden sm:flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition">
              <i class="fa-solid fa-forward-step"></i>
              <span>Simulate Next Step</span>
            </button>
          </div>

          <!-- Step Progress Visual Stepper -->
          <div class="relative mb-12">
            <!-- Background Line -->
            <div class="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0"></div>
            <!-- Active Fill Line -->
            <div
              class="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 bg-orange-500 rounded-full transition-all duration-700 z-0"
              [style.width]="getProgressPercentage() + '%'"></div>

            <!-- Steps Circle Markers -->
            <div class="relative z-10 flex justify-between">
              <div *ngFor="let step of steps; let idx = index" class="flex flex-col items-center">
                <div
                  [ngClass]="getStepCircleClass(step.status)"
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300">
                  <i [class]="step.icon"></i>
                </div>
                <span class="text-[11px] font-bold mt-2 text-slate-700 whitespace-nowrap">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- Timeline Event Logs -->
          <div class="border-t border-slate-100 pt-6">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tracking History</h4>
            <div class="space-y-4">
              <div *ngFor="let item of order.timeline" class="flex items-start space-x-3 text-xs">
                <span class="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                <div>
                  <p class="font-bold text-slate-800">{{ item.status }}</p>
                  <p class="text-slate-500">{{ item.note }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ item.timestamp | date:'shortTime' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Simulator Button -->
          <div class="sm:hidden mt-6 pt-4 border-t border-slate-100">
            <button
              (click)="advanceStatusForDemo()"
              [disabled]="order.status === 'Delivered'"
              class="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl shadow">
              Simulate Next Status Step
            </button>
          </div>
        </div>

        <!-- Rider & Restaurant Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Delivery Partner Card -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Delivery Partner"
                class="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/20 shadow">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Delivery Hero</span>
                <h4 class="text-sm font-bold text-slate-900">Alex Rodriguez</h4>
                <div class="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span class="text-amber-500 font-bold"><i class="fa-solid fa-star text-[10px]"></i> 4.95</span>
                  <span>• Honda Activa • SF-402</span>
                </div>
              </div>
            </div>

            <a href="tel:+15550199" class="w-10 h-10 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition shadow-sm">
              <i class="fa-solid fa-phone"></i>
            </a>
          </div>

          <!-- Restaurant Details Card -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img
                [src]="order.restaurant.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'"
                alt="Restaurant Logo"
                class="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Prepared By</span>
                <h4 class="text-sm font-bold text-slate-900">{{ order.restaurant.name }}</h4>
                <p class="text-xs text-slate-500 mt-0.5">{{ order.restaurant.address.street }}, {{ order.restaurant.address.city }}</p>
              </div>
            </div>

            <a [routerLink]="['/restaurants', order.restaurant._id]" class="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition shadow-sm">
              <i class="fa-solid fa-store"></i>
            </a>
          </div>

        </div>

        <!-- Ordered Items Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Receipt Details</h3>
          
          <div class="divide-y divide-slate-100">
            <div *ngFor="let item of order.items" class="py-3 flex justify-between items-center text-xs">
              <div class="flex items-center space-x-3">
                <span class="font-extrabold text-orange-600">{{ item.quantity }}x</span>
                <span class="font-semibold text-slate-800">{{ item.name }}</span>
              </div>
              <span class="font-bold text-slate-800">\${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-slate-800">\${{ order.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span class="font-bold text-slate-800">\${{ order.deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Taxes</span>
              <span class="font-bold text-slate-800">\${{ order.tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Paid ({{ order.paymentMethod }})</span>
              <span class="text-orange-600">\${{ order.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order: Order | null = null;
  loading = true;
  private pollInterval: any;

  steps = [
    { status: 'Confirmed', label: 'Confirmed', icon: 'fa-solid fa-receipt' },
    { status: 'Preparing', label: 'Preparing Food', icon: 'fa-solid fa-kitchen-set' },
    { status: 'Out for Delivery', label: 'On The Way', icon: 'fa-solid fa-motorcycle' },
    { status: 'Delivered', label: 'Delivered', icon: 'fa-solid fa-house-chimney-check' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchOrder(id);
    }
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  fetchOrder(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: res => {
        this.order = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStepIndex(status: string): number {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  }

  getProgressPercentage(): number {
    if (!this.order) return 0;
    const idx = this.getStepIndex(this.order.status);
    return (idx / (this.steps.length - 1)) * 100;
  }

  getStepCircleClass(stepStatus: string): string {
    if (!this.order) return 'bg-slate-100 text-slate-400';
    const currentIdx = this.getStepIndex(this.order.status);
    const stepIdx = this.getStepIndex(stepStatus);

    if (stepIdx < currentIdx) {
      return 'bg-emerald-500 text-white';
    } else if (stepIdx === currentIdx) {
      return 'bg-orange-500 text-white ring-4 ring-orange-500/20 scale-110';
    } else {
      return 'bg-slate-100 text-slate-400';
    }
  }

  getCurrentStatusTitle(): string {
    switch (this.order?.status) {
      case 'Confirmed':
        return 'Order Confirmed by Restaurant';
      case 'Preparing':
        return 'Chef is Cooking Your Meal';
      case 'Out for Delivery':
        return 'Rider is on the Way!';
      case 'Delivered':
        return 'Order Delivered! Enjoy!';
      default:
        return 'Order Confirmed';
    }
  }

  getCurrentStatusDescription(): string {
    switch (this.order?.status) {
      case 'Confirmed':
        return 'The restaurant accepted your order and ingredients are being prepped.';
      case 'Preparing':
        return 'Food is being freshly cooked and packed in insulated containers.';
      case 'Out for Delivery':
        return 'Alex is on their motorcycle speeding toward your address!';
      case 'Delivered':
        return 'Package was handed over at your doorstep. Bon appétit!';
      default:
        return 'Your meal will be with you shortly.';
    }
  }

  advanceStatusForDemo(): void {
    if (!this.order) return;
    const currentIdx = this.getStepIndex(this.order.status);
    if (currentIdx < this.steps.length - 1) {
      const nextStatus = this.steps[currentIdx + 1].status;
      this.orderService.updateOrderStatus(this.order._id, nextStatus).subscribe({
        next: res => {
          this.order = res.data;
        }
      });
    }
  }
}
