import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Input Atom - Atomic Design Level 1
 * Basic, reusable input component with form control support
 * 
 * Characteristics:
 * - Self-contained and independent
 * - Highly reusable
 * - Simple (single UI element)
 * - Under 100 lines
 * - Supports Angular forms (ControlValueAccessor)
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <input
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [value]="value"
      [class]="inputClasses"
      (input)="onInput($event)"
      (blur)="onTouched()"
      (focus)="onFocus()"
    />
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'search' | 'url' = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() error = false;
  @Input() value: string | number = '';
  
  @Output() valueChange = new EventEmitter<string | number>();
  @Output() focused = new EventEmitter<void>();
  
  private onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors';
    const errorClasses = this.error 
      ? 'border-error focus:ring-error focus:border-error' 
      : 'border-gray-300 focus:ring-primary focus:border-primary';
    const disabledClasses = this.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    
    return `${baseClasses} ${errorClasses} ${disabledClasses}`;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value: string | number = input.value;
    
    if (this.type === 'number' && value !== '') {
      value = parseFloat(value);
    }
    
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(): void {
    this.focused.emit();
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

