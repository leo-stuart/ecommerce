import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/product-list-page/product-list-page.component').then(
        (m) => m.ProductListPageComponent
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./pages/products/product-form-page/product-form-page.component').then(
        (m) => m.ProductFormPageComponent
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./pages/products/product-form-page/product-form-page.component').then(
        (m) => m.ProductFormPageComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/order-list-page.component').then(
        (m) => m.OrderListPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
