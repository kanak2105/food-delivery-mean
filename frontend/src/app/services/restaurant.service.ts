import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, FoodItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:5000/api/restaurants';
  private foodUrl = 'http://localhost:5000/api/foods';

  constructor(private http: HttpClient) {}

  getRestaurants(params?: {
    search?: string;
    cuisine?: string;
    minRating?: number;
    sort?: string;
  }): Observable<{ success: boolean; data: Restaurant[]; total: number }> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.cuisine && params.cuisine !== 'All') httpParams = httpParams.set('cuisine', params.cuisine);
    if (params?.minRating) httpParams = httpParams.set('minRating', params.minRating.toString());
    if (params?.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<{ success: boolean; data: Restaurant[]; total: number }>(this.apiUrl, {
      params: httpParams
    });
  }

  getRestaurantById(id: string): Observable<{
    success: boolean;
    data: {
      restaurant: Restaurant;
      menuByCategory: { [category: string]: FoodItem[] };
      allItems: FoodItem[];
    };
  }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCuisines(): Observable<{ success: boolean; data: string[] }> {
    return this.http.get<{ success: boolean; data: string[] }>(`${this.apiUrl}/meta/cuisines`);
  }

  searchFoods(query: string, category?: string): Observable<{ success: boolean; data: FoodItem[] }> {
    let params = new HttpParams().set('q', query);
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    return this.http.get<{ success: boolean; data: FoodItem[] }>(`${this.foodUrl}/search`, { params });
  }

  createRestaurant(restaurantData: Partial<Restaurant>): Observable<any> {
    return this.http.post<any>(this.apiUrl, restaurantData);
  }

  updateRestaurant(id: string, restaurantData: Partial<Restaurant>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, restaurantData);
  }
}
