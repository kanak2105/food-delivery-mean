import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem, FoodItem, Restaurant } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private activeRestaurantSubject = new BehaviorSubject<{ id: string; name: string; deliveryFee: number } | null>(null);
  public activeRestaurant$ = this.activeRestaurantSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cravebite_cart');
    const savedRestaurant = localStorage.getItem('cravebite_restaurant');

    if (savedCart) {
      try {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } catch (e) {
        this.clearCart();
      }
    }

    if (savedRestaurant) {
      try {
        this.activeRestaurantSubject.next(JSON.parse(savedRestaurant));
      } catch (e) {}
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cravebite_cart', JSON.stringify(this.cartItemsSubject.value));
    if (this.activeRestaurantSubject.value) {
      localStorage.setItem('cravebite_restaurant', JSON.stringify(this.activeRestaurantSubject.value));
    } else {
      localStorage.removeItem('cravebite_restaurant');
    }
  }

  get items(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  get activeRestaurant() {
    return this.activeRestaurantSubject.value;
  }

  addToCart(foodItem: FoodItem, restaurant: Restaurant): { success: boolean; requiresReset?: boolean } {
    const currentRestaurant = this.activeRestaurantSubject.value;

    // Check if adding from a different restaurant
    if (currentRestaurant && currentRestaurant.id !== restaurant._id && this.items.length > 0) {
      return { success: false, requiresReset: true };
    }

    // Set active restaurant if empty
    if (!currentRestaurant || this.items.length === 0) {
      this.activeRestaurantSubject.next({
        id: restaurant._id,
        name: restaurant.name,
        deliveryFee: restaurant.deliveryFee || 2.99
      });
    }

    const currentItems = [...this.cartItemsSubject.value];
    const existingIndex = currentItems.findIndex(item => item.foodItem._id === foodItem._id);

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += 1;
    } else {
      currentItems.push({
        foodItem,
        quantity: 1,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name
      });
    }

    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
    return { success: true };
  }

  updateQuantity(foodItemId: string, change: number): void {
    let currentItems = [...this.cartItemsSubject.value];
    const index = currentItems.findIndex(item => item.foodItem._id === foodItemId);

    if (index > -1) {
      const newQty = currentItems[index].quantity + change;
      if (newQty <= 0) {
        currentItems.splice(index, 1);
      } else {
        currentItems[index].quantity = newQty;
      }

      if (currentItems.length === 0) {
        this.activeRestaurantSubject.next(null);
      }

      this.cartItemsSubject.next(currentItems);
      this.saveCartToStorage();
    }
  }

  removeItem(foodItemId: string): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.foodItem._id !== foodItemId);
    if (currentItems.length === 0) {
      this.activeRestaurantSubject.next(null);
    }
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.activeRestaurantSubject.next(null);
    localStorage.removeItem('cravebite_cart');
    localStorage.removeItem('cravebite_restaurant');
  }

  // Observable Computed Values
  totalCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  subtotal$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0))
  );

  tax$ = this.subtotal$.pipe(
    map(sub => Number((sub * 0.05).toFixed(2)))
  );

  totalAmount$ = this.cartItems$.pipe(
    map(items => {
      const subtotal = items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
      if (subtotal === 0) return 0;
      const deliveryFee = this.activeRestaurantSubject.value?.deliveryFee || 2.99;
      const tax = Number((subtotal * 0.05).toFixed(2));
      return Number((subtotal + deliveryFee + tax).toFixed(2));
    })
  );
}
