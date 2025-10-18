import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                {{ title }}
              </h1>
              <p *ngIf="subtitle" class="mt-2 text-lg text-gray-600">
                {{ subtitle }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <ng-content select="[slot='actions']"></ng-content>
            </div>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div *ngIf="showFilters" class="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <ng-content select="[slot='filters']"></ng-content>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ng-content select="[slot='content']"></ng-content>
        </div>

        <div *ngIf="showPagination" class="mt-6 flex justify-center">
          <ng-content select="[slot='pagination']"></ng-content>
        </div>
      </main>

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

