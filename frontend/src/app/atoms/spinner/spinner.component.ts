import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Spinner Atom - Atomic Design Level 1
 * Loading spinner component
 * 
 * Characteristics:
 * - Self-contained and independent
 * - Highly reusable
 * - Simple (single UI element)
 * - Under 100 lines
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <div [class]="spinnerClasses"></div>
      <p *ngIf="message" class="mt-2 text-sm text-gray-600">{{ message }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'white' | 'gray' = 'primary';
  @Input() message?: string;
  @Input() center = true;

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center';
    const centerClass = this.center ? 'justify-center min-h-[200px]' : '';
    
    return `${baseClasses} ${centerClass}`;
  }

  get spinnerClasses(): string {
    const baseClasses = 'inline-block border-4 border-solid rounded-full animate-spin';
    
    const sizeClasses = {
      small: 'w-6 h-6 border-2',
      medium: 'w-12 h-12 border-4',
      large: 'w-16 h-16 border-4'
    };

    const colorClasses = {
      primary: 'border-primary border-t-transparent',
      white: 'border-white border-t-transparent',
      gray: 'border-gray-300 border-t-gray-600'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${colorClasses[this.color]}`;
  }
}

