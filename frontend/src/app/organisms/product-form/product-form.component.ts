import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { Product, CreateProductDto, UpdateProductDto } from '../../pages/products/models/product.model';

/**
 * ProductForm Organism - Atomic Design Level 3
 * Complex form component combining multiple FormField molecules
 * 
 * Characteristics:
 * - Combination of molecules and atoms
 * - Represents distinct interface section (product form)
 * - Contains form logic (Reactive Forms)
 * - Under 300 lines
 * - Can have component-level state
 * - No direct HTTP calls (delegates to page)
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, FormFieldComponent],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <app-form-field
            id="name"
            label="Product Name"
            type="text"
            placeholder="Enter product name"
            [required]="true"
            [error]="getFieldError('name')"
            formControlName="name"
          />
        </div>

        <div class="md:col-span-2">
          <label class="form-label">Description</label>
          <textarea
            formControlName="description"
            placeholder="Enter product description"
            rows="3"
            class="form-input resize-none"
            [class.border-error]="getFieldError('description')"
          ></textarea>
          <span *ngIf="getFieldError('description')" class="error-message">
            {{ getFieldError('description') }}
          </span>
        </div>

        <app-form-field
          id="price"
          label="Price"
          type="number"
          placeholder="0.00"
          [required]="true"
          [error]="getFieldError('price')"
          hint="Enter price in dollars"
          formControlName="price"
        />

        <app-form-field
          id="stock"
          label="Stock Quantity"
          type="number"
          placeholder="0"
          [required]="true"
          [error]="getFieldError('stock')"
          formControlName="stock"
        />

        <app-form-field
          id="sku"
          label="SKU"
          type="text"
          placeholder="PROD-001"
          [error]="getFieldError('sku')"
          hint="Unique product identifier"
          formControlName="sku"
        />

        <app-form-field
          id="category"
          label="Category"
          type="text"
          placeholder="Electronics"
          [error]="getFieldError('category')"
          formControlName="category"
        />

        <div class="md:col-span-2">
          <app-form-field
            id="imageUrl"
            label="Image URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            [error]="getFieldError('imageUrl')"
            formControlName="imageUrl"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4">
        <app-button
          type="button"
          variant="secondary"
          (clicked)="onCancel()"
          [disabled]="loading"
        >
          Cancel
        </app-button>

        <app-button
          type="submit"
          variant="primary"
          [disabled]="productForm.invalid || loading"
          [loading]="loading"
        >
          {{ editMode ? 'Update Product' : 'Create Product' }}
        </app-button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateProductDto | UpdateProductDto>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editMode = !!this.product;
    this.initializeForm();

    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.maxLength(50)]],
      category: ['', [Validators.maxLength(50)]],
      imageUrl: [''],
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['min']) {
      return `Value must be at least ${field.errors['min'].min}`;
    }
    if (field.errors['maxLength']) {
      return `Maximum ${field.errors['maxLength'].requiredLength} characters`;
    }

    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

