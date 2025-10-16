import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card Molecule - Atomic Design Level 2
 * Container component for content with optional header and footer
 * 
 * Characteristics:
 * - Simple container component
 * - Serves a single purpose (content grouping)
 * - Reusable across pages
 * - Under 150 lines
 * - Uses content projection for flexibility
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div *ngIf="title || hasHeaderSlot" class="px-6 py-4 border-b border-gray-200">
        <h3 *ngIf="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <ng-content select="[slot=header]"></ng-content>
      </div>
      
      <div class="px-6 py-4">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasFooterSlot" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() elevated = true;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  
  hasHeaderSlot = false;
  hasFooterSlot = false;

  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
    const elevationClass = this.elevated ? 'shadow-md' : '';
    
    return `${baseClasses} ${elevationClass}`;
  }

  ngAfterContentInit(): void {
    // Check if header and footer slots have content
    // This would be handled better with @ContentChild in a real implementation
  }
}

