import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ButtonComponent } from '../../../atoms/button/button.component';
import { SearchBarComponent } from '../../../molecules/search-bar/search-bar.component';
import { SpinnerComponent } from '../../../atoms/spinner/spinner.component';
import { ProductTableComponent } from '../../../organisms/product-table/product-table.component';
import { Product, ProductFilter } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { PaginationMeta } from '../../../core/models/api-response.model';

/**
 * ProductListPage - Atomic Design Level 5 (Page/Smart Component)
 * Complete, routable page that fetches and displays products
 * 
 * Characteristics:
 * - Complete, functional page
 * - Data-aware (smart component)
 * - Service injection and HTTP calls
 * - State management (RxJS)
 * - Navigation logic
 * - Error handling and loading states
 * - 300-500 lines acceptable for complex pages
 */
@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SearchBarComponent,
    SpinnerComponent,
    ProductTableComponent,
  ],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <app-button
          variant="primary"
          (clicked)="onCreateProduct()"
          class="mt-4 md:mt-0"
        >
          <span class="mr-2">+</span> Add Product
        </app-button>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <app-search-bar
          placeholder="Search products by name, description, or SKU..."
          (search)="onSearch($event)"
        />
      </div>

      <!-- Error Message -->
      <div 
        *ngIf="error$ | async as error" 
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
      >
        <div class="flex items-center">
          <span class="font-semibold mr-2">Error:</span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async">
        <app-spinner message="Loading products..." />
      </div>

      <!-- Products Table -->
      <div *ngIf="!(loading$ | async)" class="bg-white rounded-lg shadow">
        <app-product-table
          [products]="products"
          (edit)="onEditProduct($event)"
          (delete)="onDeleteProduct($event)"
        />
      </div>

      <!-- Pagination -->
      <div 
        *ngIf="!(loading$ | async) && products.length > 0 && paginationMeta" 
        class="mt-6 flex flex-col md:flex-row items-center justify-between"
      >
        <div class="text-sm text-gray-700 mb-4 md:mb-0">
          Showing {{ ((paginationMeta.page - 1) * paginationMeta.limit) + 1 }} 
          to {{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }} 
          of {{ paginationMeta.total }} products
        </div>

        <div class="flex gap-2">
          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasPreviousPage"
            (clicked)="onPreviousPage()"
          >
            Previous
          </app-button>

          <div class="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            Page {{ paginationMeta.page }} of {{ paginationMeta.totalPages }}
          </div>

          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasNextPage"
            (clicked)="onNextPage()"
          >
            Next
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router);
  
  products: Product[] = [];
  paginationMeta: PaginationMeta | null = null;
  currentFilter: ProductFilter = {
    page: 1,
    limit: 10,
  };

  // Expose Math for template
  Math = Math;

  // RxJS Observables from service
  loading$: Observable<boolean> = this.productService.loading$;
  error$: Observable<string | null> = this.productService.error$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService
      .getProducts(this.currentFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.paginationMeta = response.meta;
        },
        error: (error) => {
          console.error('Failed to load products:', error);
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.currentFilter = {
      ...this.currentFilter,
      page: 1, // Reset to first page
      search: searchTerm || undefined,
    };
    this.loadProducts();
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }

  onEditProduct(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  onDeleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService
        .deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
          },
          error: (error) => {
            console.error('Failed to delete product:', error);
          },
        });
    }
  }

  onPreviousPage(): void {
    if (this.paginationMeta?.hasPreviousPage) {
      this.currentFilter.page = (this.currentFilter.page || 1) - 1;
      this.loadProducts();
    }
  }

  onNextPage(): void {
    if (this.paginationMeta?.hasNextPage) {
      this.currentFilter.page = (this.currentFilter.page || 1) + 1;
      this.loadProducts();
    }
  }
}

