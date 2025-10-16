import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../../atoms/label/label.component';
import { InputComponent } from '../../atoms/input/input.component';

/**
 * FormField Molecule - Atomic Design Level 2
 * Combines Label + Input + Error message atoms
 * 
 * Characteristics:
 * - Combination of 2-5 atoms (Label, Input, Error)
 * - Serves a single purpose (form input with label)
 * - Reusable across pages
 * - Under 150 lines
 * - No HTTP calls or complex business logic
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LabelComponent, InputComponent, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-field mb-4">
      <app-label 
        *ngIf="label"
        [htmlFor]="id" 
        [required]="required"
        [size]="labelSize"
      >
        {{ label }}
      </app-label>
      
      <app-input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [error]="!!error"
        [value]="value"
        (valueChange)="onValueChange($event)"
        (focused)="onTouched()"
      />
      
      <span *ngIf="error" class="error-message block text-sm text-error mt-1">
        {{ error }}
      </span>
      
      <span *ngIf="hint && !error" class="block text-xs text-gray-500 mt-1">
        {{ hint }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() id?: string;
  @Input() label?: string;
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'search' | 'url' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() labelSize: 'small' | 'medium' | 'large' = 'medium';
  
  value: string | number = '';
  
  private onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  onValueChange(value: string | number): void {
    this.value = value;
    this.onChange(value);
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

