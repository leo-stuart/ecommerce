import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { LabelComponent } from '../../atoms/label/label.component';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    LabelComponent,
  ],
  template: `
    <div class="filter-panel">
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <span>Filtros</span>
        </h3>

        <span 
          *ngIf="activeFiltersCount > 0"
          class="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold leading-none text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm">
          {{ activeFiltersCount }} ativo
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="filter-group">
          <app-label [htmlFor]="'category'">Categoria</app-label>
          <select
            id="category"
            [(ngModel)]="filters.category"
            (change)="onFilterChange()"
            class="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border transition-all duration-200 hover:border-gray-400">
            <option [value]="''">Todas as Categorias</option>
            <option 
              *ngFor="let cat of categories" 
              [value]="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <app-label [htmlFor]="'minPrice'">Preço Mínimo (R$)</app-label>
          <input
            id="minPrice"
            type="number"
            [(ngModel)]="filters.minPrice"
            (input)="onFilterChange()"
            placeholder="0"
            min="0"
            step="0.01"
            class="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border transition-all duration-200 hover:border-gray-400" />
        </div>

        <div class="filter-group">
          <app-label [htmlFor]="'maxPrice'">Preço Máximo (R$)</app-label>
          <input
            id="maxPrice"
            type="number"
            [(ngModel)]="filters.maxPrice"
            (input)="onFilterChange()"
            placeholder="∞"
            min="0"
            step="0.01"
            class="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border transition-all duration-200 hover:border-gray-400" />
        </div>

        <div class="filter-group">
          <app-label [htmlFor]="'stockStatus'">Status do Estoque</app-label>
          <select
            id="stockStatus"
            [(ngModel)]="stockStatusValue"
            (change)="onStockStatusChange()"
            class="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border transition-all duration-200 hover:border-gray-400">
            <option value="all">Todos os Produtos</option>
            <option value="inStock">Apenas em Estoque</option>
            <option value="outOfStock">Sem Estoque</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <app-button
          *ngIf="activeFiltersCount > 0"
          [type]="'button'"
          [variant]="'secondary'"
          [size]="'small'"
          (click)="onClearFilters()">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpar Filtros
        </app-button>

        <app-button
          [type]="'button'"
          [variant]="'primary'"
          [size]="'small'"
          [class]="'sm:hidden'"
          (click)="onApplyFilters()">
          Aplicar Filtros
        </app-button>
      </div>

      <div *ngIf="activeFiltersCount > 0" class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Filtros ativos:</p>
        <div class="flex flex-wrap gap-2">
          <span 
            *ngIf="filters.category"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            Categoria: {{ filters.category }}
            <button 
              type="button"
              (click)="removeFilter('category')"
              class="hover:text-blue-900">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clip-rule="evenodd" />
              </svg>
            </button>
          </span>

          <span 
            *ngIf="filters.minPrice !== undefined || filters.maxPrice !== undefined"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
            Preço: {{ formatPriceRange() }}
            <button 
              type="button"
              (click)="removeFilter('price')"
              class="hover:text-green-900">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clip-rule="evenodd" />
              </svg>
            </button>
          </span>

          <span 
            *ngIf="filters.inStock !== undefined"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">
            {{ filters.inStock ? 'Em Estoque' : 'Sem Estoque' }}
            <button 
              type="button"
              (click)="removeFilter('stock')"
              class="hover:text-purple-900">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      @apply w-full;
    }

    .filter-group {
      @apply flex flex-col;
    }
  `],
})
export class FilterPanelComponent implements OnInit {
  /**
   * Available categories for filtering
   */
  @Input() categories: string[] = [
    'Electronics',
    'Books',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Toys',
    'Food & Beverages',
  ];

  /**
   * Initial filter values
   */
  @Input() initialFilters: ProductFilters = {};

  /**
   * Event emitted when filters change (auto-apply on desktop)
   */
  @Output() filtersChange = new EventEmitter<ProductFilters>();

  /**
   * Event emitted when apply button clicked (mobile)
   */
  @Output() filtersApply = new EventEmitter<ProductFilters>();

  /**
   * Event emitted when clear filters clicked
   */
  @Output() filtersClear = new EventEmitter<void>();

  /**
   * Current filter state
   */
  filters: ProductFilters = {};

  /**
   * Stock status dropdown value
   */
  stockStatusValue: 'all' | 'inStock' | 'outOfStock' = 'all';

  /**
   * Debounce timer for filter changes
   */
  private filterChangeTimer: any;

  ngOnInit(): void {
    // Initialize filters from input with defaults
    this.filters = { 
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      ...this.initialFilters 
    };
    
    // Set stock status dropdown value
    if (this.filters.inStock === true) {
      this.stockStatusValue = 'inStock';
    } else if (this.filters.inStock === false) {
      this.stockStatusValue = 'outOfStock';
    }
  }

  /**
   * Get count of active filters
   */
  get activeFiltersCount(): number {
    let count = 0;
    if (this.filters.category) count++;
    if (this.filters.minPrice !== undefined && this.filters.minPrice !== null) count++;
    if (this.filters.maxPrice !== undefined && this.filters.maxPrice !== null) count++;
    if (this.filters.inStock !== undefined) count++;
    return count;
  }

  /**
   * Handle filter change with debouncing
   */
  onFilterChange(): void {
    // Clear existing timer
    if (this.filterChangeTimer) {
      clearTimeout(this.filterChangeTimer);
    }

    // Emit after 500ms of no changes (debounce)
    this.filterChangeTimer = setTimeout(() => {
      this.emitFilters();
    }, 500);
  }

  /**
   * Handle stock status dropdown change
   */
  onStockStatusChange(): void {
    if (this.stockStatusValue === 'all') {
      delete this.filters.inStock;
    } else if (this.stockStatusValue === 'inStock') {
      this.filters.inStock = true;
    } else {
      this.filters.inStock = false;
    }
    this.onFilterChange();
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.filters = {};
    this.stockStatusValue = 'all';
    this.filtersClear.emit();
    this.emitFilters();
  }

  /**
   * Apply filters (for mobile)
   */
  onApplyFilters(): void {
    this.filtersApply.emit(this.getCleanFilters());
  }

  /**
   * Remove specific filter
   */
  removeFilter(filterType: 'category' | 'price' | 'stock'): void {
    switch (filterType) {
      case 'category':
        delete this.filters.category;
        break;
      case 'price':
        delete this.filters.minPrice;
        delete this.filters.maxPrice;
        break;
      case 'stock':
        delete this.filters.inStock;
        this.stockStatusValue = 'all';
        break;
    }
    this.emitFilters();
  }

  /**
   * Format price range for display
   */
  formatPriceRange(): string {
    const min = this.filters.minPrice;
    const max = this.filters.maxPrice;

    if (min !== undefined && max !== undefined) {
      return `$${min} - $${max}`;
    } else if (min !== undefined) {
      return `From $${min}`;
    } else if (max !== undefined) {
      return `Up to $${max}`;
    }
    return '';
  }

  /**
   * Emit filter changes
   */
  private emitFilters(): void {
    this.filtersChange.emit(this.getCleanFilters());
  }

  /**
   * Get filters without undefined/null values
   */
  private getCleanFilters(): ProductFilters {
    const clean: ProductFilters = {};

    if (this.filters.category) {
      clean.category = this.filters.category;
    }
    if (this.filters.minPrice !== undefined && this.filters.minPrice !== null) {
      clean.minPrice = Number(this.filters.minPrice);
    }
    if (this.filters.maxPrice !== undefined && this.filters.maxPrice !== null) {
      clean.maxPrice = Number(this.filters.maxPrice);
    }
    if (this.filters.inStock !== undefined) {
      clean.inStock = this.filters.inStock;
    }

    return clean;
  }
}

