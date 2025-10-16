import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { Product } from '../../pages/products/models/product.model';

/**
 * ProductTable Organism - Atomic Design Level 3
 * Complex table component for displaying products
 * 
 * Characteristics:
 * - Combination of molecules and atoms
 * - Represents distinct interface section (product list)
 * - Contains table logic and interactions
 * - Under 300 lines
 * - No direct HTTP calls (delegates to page)
 */
@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="overflow-x-auto">
      <!-- Desktop Table View -->
      <table class="hidden md:table min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let product of products; trackBy: trackByFn" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              <div class="text-sm text-gray-500">{{ product.sku }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ product.category || 'Uncategorized' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              \${{ product.price.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                [class]="product.stock > 0 ? 'text-success' : 'text-error'"
                class="text-sm font-medium"
              >
                {{ product.stock }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <app-button
                  variant="secondary"
                  size="small"
                  (clicked)="onEdit(product)"
                >
                  Edit
                </app-button>
                <app-button
                  variant="danger"
                  size="small"
                  (clicked)="onDelete(product)"
                >
                  Delete
                </app-button>
              </div>
            </td>
          </tr>
          
          <tr *ngIf="products.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              <div class="text-lg mb-2">No products found</div>
              <div class="text-sm">Create your first product to get started</div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4">
        <div 
          *ngFor="let product of products; trackBy: trackByFn"
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-base font-semibold text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.sku }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ product.category || 'Uncategorized' }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div class="text-xs text-gray-500">Price</div>
              <div class="text-sm font-medium text-gray-900">\${{ product.price.toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Stock</div>
              <div 
                [class]="product.stock > 0 ? 'text-success' : 'text-error'"
                class="text-sm font-medium"
              >
                {{ product.stock }}
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <app-button
              variant="secondary"
              size="small"
              [fullWidth]="true"
              (clicked)="onEdit(product)"
            >
              Edit
            </app-button>
            <app-button
              variant="danger"
              size="small"
              [fullWidth]="true"
              (clicked)="onDelete(product)"
            >
              Delete
            </app-button>
          </div>
        </div>

        <div *ngIf="products.length === 0" class="text-center py-12">
          <div class="text-lg text-gray-500 mb-2">No products found</div>
          <div class="text-sm text-gray-400">Create your first product to get started</div>
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
export class ProductTableComponent {
  @Input() products: Product[] = [];
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  trackByFn(index: number, item: Product): number {
    return item.id;
  }

  onEdit(product: Product): void {
    this.edit.emit(product);
  }

  onDelete(product: Product): void {
    this.delete.emit(product);
  }
}

