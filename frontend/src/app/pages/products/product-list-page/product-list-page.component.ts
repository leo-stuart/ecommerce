import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ButtonComponent } from '../../../atoms/button/button.component';
import { SearchBarComponent } from '../../../molecules/search-bar/search-bar.component';
import { SpinnerComponent } from '../../../atoms/spinner/spinner.component';
import { ProductTableComponent } from '../../../organisms/product-table/product-table.component';
import { FilterPanelComponent, ProductFilters } from '../../../organisms/filter-panel/filter-panel.component';
import { ListLayoutComponent } from '../../../templates/list-layout/list-layout.component';
import { Product, ProductFilter } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { PaginationMeta } from '../../../core/models/api-response.model';
import { ToastService } from '../../../core/services/toast.service';

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
    FilterPanelComponent,
    ListLayoutComponent,
  ],
  template: `
    <app-list-layout 
      [title]="'Products'"
      [subtitle]="'Manage your product inventory'"
      [showFilters]="true"
      [showPagination]="true">
      
      <!-- Actions Slot -->
      <div slot="actions">
        <app-button
          variant="primary"
          (clicked)="onCreateProduct()">
          <span class="mr-2">+</span> Add Product
        </app-button>
      </div>

      <!-- Filters Slot -->
      <div slot="filters" class="space-y-4">
        <!-- Search Bar -->
        <app-search-bar
          placeholder="Search products by name, description, or SKU..."
          (search)="onSearch($event)" />

        <!-- Advanced Filters -->
        <app-filter-panel
          [categories]="availableCategories"
          [initialFilters]="currentAdvancedFilters"
          (filtersChange)="onFiltersChange($event)"
          (filtersClear)="onFiltersClear()" />
      </div>

      <!-- Content Slot -->
      <div slot="content">
        <!-- Error Message -->
        <div 
          *ngIf="error$ | async as error" 
          class="p-4 bg-red-50 border-b border-red-200 text-red-800">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clip-rule="evenodd" />
            </svg>
            <span class="font-semibold mr-2">Error:</span>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async" class="p-8">
          <app-spinner message="Loading products..." />
        </div>

        <!-- Products Table -->
        <app-product-table
          *ngIf="!(loading$ | async)"
          [products]="products"
          (edit)="onEditProduct($event)"
          (delete)="onDeleteProduct($event)" />

        <!-- No Results -->
        <div 
          *ngIf="!(loading$ | async) && products.length === 0"
          class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      </div>

      <!-- Pagination Slot -->
      <div 
        slot="pagination"
        *ngIf="!(loading$ | async) && products.length > 0 && paginationMeta"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
        
        <!-- Results Info -->
        <div class="text-sm text-gray-700">
          Showing 
          <span class="font-medium">{{ ((paginationMeta.page - 1) * paginationMeta.limit) + 1 }}</span>
          to 
          <span class="font-medium">{{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }}</span>
          of 
          <span class="font-medium">{{ paginationMeta.total }}</span>
          products
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasPreviousPage"
            (clicked)="onPreviousPage()">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </app-button>

          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
            Page {{ paginationMeta.page }} of {{ paginationMeta.totalPages }}
          </div>

          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasNextPage"
            (clicked)="onNextPage()">
            Next
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </app-button>
        </div>
      </div>
    </app-list-layout>
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
  private toastService = inject(ToastService);
  
  products: Product[] = [];
  paginationMeta: PaginationMeta | null = null;
  currentFilter: ProductFilter = {
    page: 1,
    limit: 10,
  };

  // Advanced filters state
  currentAdvancedFilters: ProductFilters = {};
  availableCategories: string[] = [
    'Electronics',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Toys',
    'Food & Beverages',
  ];

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

  onFiltersChange(filters: ProductFilters): void {
    // Store advanced filters
    this.currentAdvancedFilters = filters;

    // Update current filter with advanced filters
    this.currentFilter = {
      ...this.currentFilter,
      page: 1, // Reset to first page
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
    };
    this.loadProducts();
  }

  onFiltersClear(): void {
    // Clear advanced filters
    this.currentAdvancedFilters = {};

    // Remove advanced filters from current filter
    const { category, minPrice, maxPrice, inStock, ...baseFilters } = this.currentFilter;
    this.currentFilter = {
      ...baseFilters,
      page: 1,
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
    // Use modern confirmation with toast
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      this.productService
        .deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.deleteSuccess(`Product "${product.name}"`);
            this.loadProducts();
          },
          error: (error) => {
            console.error('Failed to delete product:', error);
            this.toastService.error(
              'Failed to delete product. Please try again.',
              'Delete Failed'
            );
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

