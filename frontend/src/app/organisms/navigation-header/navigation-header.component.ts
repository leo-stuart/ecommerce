import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navigation-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <header class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                E-commerce CRUD
              </h1>
            </div>
          </div>

          <nav class="hidden md:flex items-center space-x-1">
            <a
              routerLink="/products"
              routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Produtos</span>
            </a>
            <a
              routerLink="/orders"
              routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Pedidos</span>
            </a>
          </nav>

          <div class="md:hidden">
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              [attr.aria-expanded]="isMobileMenuOpen">
              <span class="sr-only">Abrir menu principal</span>
              <svg
                *ngIf="!isMobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                *ngIf="isMobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          *ngIf="isMobileMenuOpen"
          class="md:hidden border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a
              routerLink="/products"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-blue-50 text-blue-600"
              [routerLinkActiveOptions]="{ exact: false }"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition-colors duration-200">
              Produtos
            </a>
            <a
              routerLink="/orders"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-blue-50 text-blue-600"
              [routerLinkActiveOptions]="{ exact: false }"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition-colors duration-200">
              Pedidos
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class NavigationHeaderComponent {
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
