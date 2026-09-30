export interface Address {
  _id?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'restaurant' | 'admin' | 'delivery';
  avatar?: string;
  addresses?: Address[];
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  totalReviews: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  minimumOrder: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  bannerImage: string;
  logo: string;
  isOpen: boolean;
  featured?: boolean;
}

export interface FoodItem {
  _id: string;
  restaurant: string | Restaurant;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isSpicy?: boolean;
  isAvailable: boolean;
  rating?: number;
  calories?: number;
  preparationTimeMinutes?: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface OrderTimelineItem {
  status: string;
  timestamp: string | Date;
  note: string;
}

export interface Order {
  _id: string;
  user: string | User;
  restaurant: Restaurant;
  items: {
    foodItem: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
    instructions?: string;
  };
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  estimatedDeliveryTime?: string | Date;
  timeline: OrderTimelineItem[];
  createdAt: string;
  updatedAt: string;
}
