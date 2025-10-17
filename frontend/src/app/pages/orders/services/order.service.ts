import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Order, OrderDetails, CreateOrderDto, UpdateOrderDto, OrderFilter } from '../models/order.model';

/**
 * Order Service
 * Handles all HTTP requests for orders
 * Manages order state with RxJS BehaviorSubjects
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  // State management with RxJS
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  /**
   * Get all orders with filters
   */
  getOrders(filter: OrderFilter = {}): Observable<ApiResponse<Order[]>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());
    if (filter.status) params = params.set('status', filter.status);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);

    return this.http.get<ApiResponse<Order[]>>(this.apiUrl, { params }).pipe(
      tap((response) => {
        this.ordersSubject.next(response.data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.errorSubject.next(error.message || 'Failed to fetch orders');
        this.loadingSubject.next(false);
        return of({ data: [], success: false } as ApiResponse<Order[]>);
      }),
    );
  }

  /**
   * Get single order by ID
   */
  getOrder(id: number): Observable<ApiResponse<OrderDetails>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<ApiResponse<OrderDetails>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.errorSubject.next(error.message || 'Failed to fetch order');
        this.loadingSubject.next(false);
        throw error;
      }),
    );
  }

  /**
   * Create new order
   */
  createOrder(createDto: CreateOrderDto): Observable<ApiResponse<OrderDetails>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<ApiResponse<OrderDetails>>(this.apiUrl, createDto).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.errorSubject.next(error.error?.message || 'Failed to create order');
        this.loadingSubject.next(false);
        throw error;
      }),
    );
  }

  /**
   * Update order
   */
  updateOrder(id: number, updateDto: UpdateOrderDto): Observable<ApiResponse<OrderDetails>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.patch<ApiResponse<OrderDetails>>(`${this.apiUrl}/${id}`, updateDto).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.errorSubject.next(error.error?.message || 'Failed to update order');
        this.loadingSubject.next(false);
        throw error;
      }),
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(id: number): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.errorSubject.next(error.error?.message || 'Failed to cancel order');
        this.loadingSubject.next(false);
        throw error;
      }),
    );
  }

  /**
   * Get order statistics
   */
  getStatistics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/statistics`);
  }
}

