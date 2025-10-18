import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ButtonComponent } from '../../atoms/button/button.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';
import { ListLayoutComponent } from '../../templates/list-layout/list-layout.component';
import { Order, OrderFilter } from './models/order.model';
import { OrderService } from './services/order.service';
import { PaginationMeta } from '../../core/models/api-response.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SpinnerComponent,
    SearchBarComponent,
    ListLayoutComponent,
  ],
  template: `
    <app-list-layout
      [title]="'Pedidos'"
      [subtitle]="'Gerencie pedidos de clientes'"
      [showFilters]="true"
      [showPagination]="true">
      
      <!-- Actions Slot -->
      <div slot="actions">
        <app-button
          variant="primary"
          (clicked)="onCreateOrder()">
          <span class="mr-2">+</span> Novo Pedido
        </app-button>
      </div>

      <!-- Filters Slot -->
      <div slot="filters">
        <app-search-bar
          placeholder="Buscar por nome ou email do cliente..."
          (search)="onSearch($event)" />
        
        <!-- Status Filter -->
        <div class="mt-4 flex gap-2 flex-wrap">
          <button
            *ngFor="let status of statuses"
            (click)="onFilterByStatus(status.value)"
            [class]="getStatusButtonClass(status.value)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Content Slot -->
      <div slot="content">
        <!-- Error Message -->
        <div 
          *ngIf="error$ | async as error" 
          class="p-4 bg-red-50 border-b border-red-200 text-red-800">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clip-rule="evenodd" />
            </svg>
            <span class="font-semibold mr-2">Erro:</span>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async" class="p-8">
          <app-spinner message="Carregando pedidos..." />
        </div>

        <!-- Orders Table -->
        <div *ngIf="!(loading$ | async)" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID do Pedido
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of orders; trackBy: trackByOrderId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                  <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.itemCount }} item(ns)
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  R$ {{ order.totalAmount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    (click)="onViewOrder(order)"
                    class="text-blue-600 hover:text-blue-900 mr-3">
                    Ver
                  </button>
                  <button
                    *ngIf="order.status !== 'cancelled' && order.status !== 'completed'"
                    (click)="onCancelOrder(order)"
                    class="text-red-600 hover:text-red-900">
                    Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- No Results -->
          <div 
            *ngIf="orders.length === 0"
            class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum pedido encontrado</h3>
            <p class="mt-1 text-sm text-gray-500">
              Comece criando um novo pedido
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination Slot -->
      <div 
        slot="pagination"
        *ngIf="!(loading$ | async) && orders.length > 0 && paginationMeta"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
        
        <!-- Results Info -->
        <div class="text-sm text-gray-700">
          Mostrando 
          <span class="font-medium">{{ ((paginationMeta.page - 1) * paginationMeta.limit) + 1 }}</span>
          até 
          <span class="font-medium">{{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }}</span>
          de 
          <span class="font-medium">{{ paginationMeta.total }}</span>
          pedidos
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasPreviousPage"
            (clicked)="onPreviousPage()">
            Anterior
          </app-button>

          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
            Página {{ paginationMeta.page }} de {{ paginationMeta.totalPages }}
          </div>

          <app-button
            variant="secondary"
            size="small"
            [disabled]="!paginationMeta.hasNextPage"
            (clicked)="onNextPage()">
            Próximo
          </app-button>
        </div>
      </div>
    </app-list-layout>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class OrderListPageComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  orders: Order[] = [];
  paginationMeta: PaginationMeta | null = null;
  currentFilter: OrderFilter = {
    page: 1,
    limit: 10,
  };

  statuses = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendente' },
    { value: 'processing', label: 'Processando' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  // Expose Math for template
  Math = Math;

  // RxJS Observables from service
  loading$: Observable<boolean> = this.orderService.loading$;
  error$: Observable<string | null> = this.orderService.error$;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.orderService
      .getOrders(this.currentFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.data;
          this.paginationMeta = response.meta;
        },
        error: (error) => {
          console.error('Failed to load orders:', error);
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.currentFilter = {
      ...this.currentFilter,
      page: 1,
      search: searchTerm || undefined,
    };
    this.loadOrders();
  }

  onFilterByStatus(status: string): void {
    this.currentFilter = {
      ...this.currentFilter,
      page: 1,
      status: status as any || undefined,
    };
    this.loadOrders();
  }

  onCreateOrder(): void {
    this.toastService.info('Order creation page coming soon!', 'Feature In Development');
    // this.router.navigate(['/orders/create']);
  }

  onViewOrder(order: Order): void {
    this.toastService.info(`Viewing order #${order.id}`, 'Feature In Development');
    // this.router.navigate(['/orders', order.id]);
  }

  onCancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      this.orderService
        .cancelOrder(order.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success(`Order #${order.id} cancelled successfully`);
            this.loadOrders();
          },
          error: (error) => {
            console.error('Failed to cancel order:', error);
            this.toastService.error('Failed to cancel order', 'Error');
          },
        });
    }
  }

  onPreviousPage(): void {
    if (this.paginationMeta?.hasPreviousPage) {
      this.currentFilter.page = (this.currentFilter.page || 1) - 1;
      this.loadOrders();
    }
  }

  onNextPage(): void {
    if (this.paginationMeta?.hasNextPage) {
      this.currentFilter.page = (this.currentFilter.page || 1) + 1;
      this.loadOrders();
    }
  }

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    const statusClasses: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  }

  getStatusButtonClass(status: string): string {
    if (status === (this.currentFilter.status || '')) {
      return 'bg-blue-500 text-white';
    }
    return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

