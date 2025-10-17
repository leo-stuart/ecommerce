import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Form Layout Template - Atomic Design Level 4: TEMPLATE
 * 
 * Purpose: Provides consistent page structure for form views (create/edit)
 * Contains: Layout structure, header with actions, form container
 * Does NOT contain: Business logic, HTTP calls, actual form fields
 * 
 * Reusability: High - Use for any form-based page
 * Size: < 200 lines (template focused)
 * 
 * Usage:
 * <app-form-layout 
 *   [title]="'Create Product'" 
 *   [showBackButton]="true"
 *   (back)="onBack()">
 *   <div slot="form">Your form component here</div>
 * </app-form-layout>
 */
@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center gap-4">
            <!-- Back Button -->
            <button
              *ngIf="showBackButton"
              type="button"
              (click)="onBackClick()"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              [attr.aria-label]="'Go back'">
              <!-- Back Arrow Icon -->
              <svg 
                class="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <!-- Page Title -->
            <div class="flex-1">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ title }}
              </h1>
              <p *ngIf="subtitle" class="mt-1 text-sm text-gray-600">
                {{ subtitle }}
              </p>
            </div>

            <!-- Header Actions Slot -->
            <div class="flex items-center gap-2">
              <ng-content select="[slot='header-actions']"></ng-content>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Information/Alert Section (Optional) -->
        <div *ngIf="showAlert" class="mb-6">
          <ng-content select="[slot='alert']"></ng-content>
        </div>

        <!-- Form Container -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <ng-content select="[slot='form']"></ng-content>
        </div>

        <!-- Additional Info Section (Optional) -->
        <div *ngIf="showInfo" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ng-content select="[slot='info']"></ng-content>
        </div>
      </main>

      <!-- Sticky Footer for Form Actions (Optional) -->
      <footer 
        *ngIf="showStickyFooter" 
        class="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ng-content select="[slot='footer-actions']"></ng-content>
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
export class FormLayoutComponent {
  /**
   * Form page title (e.g., "Create Product", "Edit Product")
   */
  @Input() title: string = '';

  /**
   * Optional subtitle/description
   */
  @Input() subtitle?: string;

  /**
   * Whether to show back button
   */
  @Input() showBackButton: boolean = true;

  /**
   * Whether to show alert section
   */
  @Input() showAlert: boolean = false;

  /**
   * Whether to show info section
   */
  @Input() showInfo: boolean = false;

  /**
   * Whether to show sticky footer for actions
   */
  @Input() showStickyFooter: boolean = false;

  /**
   * Event emitted when back button is clicked
   */
  @Output() back = new EventEmitter<void>();

  /**
   * Handle back button click
   */
  onBackClick(): void {
    this.back.emit();
  }
}

