import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilter,
} from '../models/product.model';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../../core/models/api-response.model';

/**
 * Product Service
 * Handles all HTTP requests for products and manages product state with RxJS
 * Uses BehaviorSubject for reactive state management
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  // State management with RxJS BehaviorSubject
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables for components to subscribe to
  public products$ = this.productsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all products with optional filters and pagination
   */
  getProducts(filter?: ProductFilter): Observable<PaginatedApiResponse<Product>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();

    if (filter) {
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.search) params = params.set('search', filter.search);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.minPrice !== undefined)
        params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined)
        params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.inStock !== undefined)
        params = params.set('inStock', filter.inStock.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    }

    return this.http
      .get<PaginatedApiResponse<Product>>(this.apiUrl, { params })
      .pipe(
        tap({
          next: (response) => {
            this.productsSubject.next(response.data);
            this.loadingSubject.next(false);
          },
          error: (error) => {
            this.errorSubject.next(
              error.error?.error?.message || 'Failed to load products',
            );
            this.loadingSubject.next(false);
          },
        }),
      );
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<ApiResponse<Product>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => this.loadingSubject.next(false),
        error: (error) => {
          this.errorSubject.next(
            error.error?.error?.message || 'Failed to load product',
          );
          this.loadingSubject.next(false);
        },
      }),
    );
  }

  /**
   * Create a new product
   */
  createProduct(
    product: CreateProductDto,
  ): Observable<ApiResponse<Product>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      tap({
        next: (response) => {
          // Add new product to state
          const currentProducts = this.productsSubject.value;
          this.productsSubject.next([response.data, ...currentProducts]);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.errorSubject.next(
            error.error?.error?.message || 'Failed to create product',
          );
          this.loadingSubject.next(false);
        },
      }),
    );
  }

  /**
   * Update an existing product
   */
  updateProduct(
    id: number,
    product: UpdateProductDto,
  ): Observable<ApiResponse<Product>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .patch<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(
        tap({
          next: (response) => {
            // Update product in state
            const currentProducts = this.productsSubject.value;
            const updatedProducts = currentProducts.map((p) =>
              p.id === id ? response.data : p,
            );
            this.productsSubject.next(updatedProducts);
            this.loadingSubject.next(false);
          },
          error: (error) => {
            this.errorSubject.next(
              error.error?.error?.message || 'Failed to update product',
            );
            this.loadingSubject.next(false);
          },
        }),
      );
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          // Remove product from state
          const currentProducts = this.productsSubject.value;
          const filteredProducts = currentProducts.filter((p) => p.id !== id);
          this.productsSubject.next(filteredProducts);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.errorSubject.next(
            error.error?.error?.message || 'Failed to delete product',
          );
          this.loadingSubject.next(false);
        },
      }),
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}

