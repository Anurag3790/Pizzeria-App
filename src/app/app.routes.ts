import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Pizzeria | Home'
  },
  {
    path: 'order-pizza',
    loadComponent: () =>
      import('./components/order-pizza/order-pizza.component').then(m => m.OrderPizzaComponent),
    title: 'Pizzeria | Order Pizza'
  },
  {
    path: 'build-pizza',
    loadComponent: () =>
      import('./components/build-pizza/build-pizza.component').then(m => m.BuildPizzaComponent),
    title: 'Pizzeria | Build Ur Pizza'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'Pizzeria | Cart'
  },
  { path: '**', redirectTo: 'home' }
];
