import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * List Layout Template - Atomic Design Level 4: TEMPLATE
 * 
 * Purpose: Provides consistent page structure for list views
 * Contains: Layout structure, content projection slots
 * Does NOT contain: Business logic, HTTP calls, data fetching
 * 
 * Reusability: High - Use for any list-based page
 * Size: < 200 lines (template focused)
 * 
 * Usage:
 * <app-list-layout [title]="'Products'">
 *   <div slot="actions">Action buttons here</div>
 *   <div slot="filters">Filter components here</div>
 *   <div slot="content">Main content here</div>
 *   <div slot="pagination">Pagination controls here</div>
 * </app-list-layout>
 */
@Component({
  selector: 'app-list-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Page Title -->
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ title }}
              </h1>
              <p *ngIf="subtitle" class="mt-1 text-sm text-gray-600">
                {{ subtitle }}
              </p>
            </div>

            <!-- Actions Slot -->
            <div class="flex items-center gap-2">
              <ng-content select="[slot='actions']"></ng-content>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters Section -->
        <div *ngIf="showFilters" class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <ng-content select="[slot='filters']"></ng-content>
        </div>

        <!-- Content Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ng-content select="[slot='content']"></ng-content>
        </div>

        <!-- Pagination Section -->
        <div *ngIf="showPagination" class="mt-6 flex justify-center">
          <ng-content select="[slot='pagination']"></ng-content>
        </div>
      </main>

      <!-- Footer (Optional) -->
      <footer *ngIf="showFooter" class="mt-auto py-6 bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ng-content select="[slot='footer']"></ng-content>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class ListLayoutComponent {
  /**
   * Page title displayed in header
   */
  @Input() title: string = '';

  /**
   * Optional subtitle/description
   */
  @Input() subtitle?: string;

  /**
   * Whether to show filters section
   */
  @Input() showFilters: boolean = true;

  /**
   * Whether to show pagination section
   */
  @Input() showPagination: boolean = true;

  /**
   * Whether to show footer
   */
  @Input() showFooter: boolean = false;
}

