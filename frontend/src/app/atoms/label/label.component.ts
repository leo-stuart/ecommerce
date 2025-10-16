import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Label Atom - Atomic Design Level 1
 * Basic, reusable label component
 * 
 * Characteristics:
 * - Self-contained and independent
 * - Highly reusable
 * - Simple (single UI element)
 * - Under 100 lines
 */
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [for]="htmlFor" [class]="labelClasses">
      <ng-content></ng-content>
      <span *ngIf="required" class="text-error ml-1">*</span>
    </label>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LabelComponent {
  @Input() htmlFor?: string;
  @Input() required = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get labelClasses(): string {
    const baseClasses = 'block font-medium text-gray-700';
    
    const sizeClasses = {
      small: 'text-xs mb-0.5',
      medium: 'text-sm mb-1',
      large: 'text-base mb-1.5'
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  }
}

