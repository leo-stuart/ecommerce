import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ProductFormComponent } from '../../../organisms/product-form/product-form.component';
import { SpinnerComponent } from '../../../atoms/spinner/spinner.component';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * ProductFormPage - Atomic Design Level 5 (Page/Smart Component)
 * Page for creating/editing products
 * 
 * Characteristics:
 * - Complete, functional page
 * - Data-aware (smart component)
 * - Service injection and HTTP calls
 * - State management (RxJS)
 * - Navigation logic
 * - Handles both create and edit modes
 */
@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, SpinnerComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ editMode ? 'Edit Product' : 'Create New Product' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ editMode ? 'Update product information' : 'Add a new product to your inventory' }}
        </p>
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
      <div *ngIf="loadingProduct" class="bg-white rounded-lg shadow p-8">
        <app-spinner message="Loading product..." [center]="false" />
      </div>

      <!-- Form -->
      <div *ngIf="!loadingProduct" class="bg-white rounded-lg shadow p-6">
        <app-product-form
          [product]="product"
          [loading]="(loading$ | async) || false"
          (save)="onSave($event)"
          (cancel)="onCancel()"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductFormPageComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  
  editMode = false;
  productId?: number;
  product?: Product;
  loadingProduct = false;

  // RxJS Observables from service
  loading$: Observable<boolean> = this.productService.loading$;
  error$: Observable<string | null> = this.productService.error$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.editMode = true;
      this.productId = +id;
      this.loadProduct();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loadingProduct = true;
    this.productService
      .getProduct(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.product = response.data;
          this.loadingProduct = false;
        },
        error: (error) => {
          console.error('Failed to load product:', error);
          this.loadingProduct = false;
          // Navigate back if product not found
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        },
      });
  }

  onSave(productData: CreateProductDto | UpdateProductDto): void {
    if (this.editMode && this.productId) {
      // Update existing product
      this.productService
        .updateProduct(this.productId, productData as UpdateProductDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastService.updateSuccess('Product');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Failed to update product:', error);
            this.toastService.error(
              'Failed to update product. Please check your input and try again.',
              'Update Failed'
            );
          },
        });
    } else {
      // Create new product
      this.productService
        .createProduct(productData as CreateProductDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastService.createSuccess('Product');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Failed to create product:', error);
            this.toastService.error(
              'Failed to create product. Please check your input and try again.',
              'Create Failed'
            );
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

