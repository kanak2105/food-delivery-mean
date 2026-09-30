import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  createOrder(orderData: {
    restaurantId: string;
    items: { foodItemId: string; quantity: number }[];
    deliveryAddress: any;
    paymentMethod: string;
  }): Observable<{ success: boolean; message: string; data: Order }> {
    return this.http.post<any>(this.apiUrl, orderData, {
      headers: this.getAuthHeaders()
    });
  }

  getMyOrders(): Observable<{ success: boolean; count: number; data: Order[] }> {
    return this.http.get<any>(`${this.apiUrl}/my-orders`, {
      headers: this.getAuthHeaders()
    });
  }

  getOrderById(id: string): Observable<{ success: boolean; data: Order }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateOrderStatus(orderId: string, status: string, note?: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${orderId}/status`,
      { status, note },
      { headers: this.getAuthHeaders() }
    );
  }

  getAllOrders(status?: string): Observable<{ success: boolean; count: number; data: Order[] }> {
    let url = this.apiUrl;
    if (status && status !== 'All') {
      url += `?status=${status}`;
    }
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
