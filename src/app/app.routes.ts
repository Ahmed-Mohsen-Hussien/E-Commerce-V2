import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/login/login.component').then((c) => c.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./core/auth/register/register.component').then((c) => c.RegisterComponent),
        title: 'Register',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./core/auth/reset-password/reset-password.component').then(
            (c) => c.ResetPasswordComponent,
          ),
        title: 'Reset Password',
      },
      {
        path: 'set-new-password',
        loadComponent: () =>
          import('./core/auth/set-new-password/set-new-password.component').then(
            (c) => c.SetNewPasswordComponent,
          ),
        title: 'Set New Password',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
        title: 'Home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products.component').then((c) => c.ProductsComponent),
        title: 'Products',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/brands/brands.component').then((c) => c.BrandsComponent),
        title: 'Brands',
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then((c) => c.CartComponent),
        title: 'Cart',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then((c) => c.CategoriesComponent),
        title: 'Categories',
      },
      {
        path: 'checkout/:id',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
        title: 'Checkout',
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./features/allorders/allorders.component').then((c) => c.AllordersComponent),
        title: 'My Orders',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then((c) => c.WishlistComponent),
        title: 'Wishlist',
      },
      {
        path: 'details/:slug/:id',
        loadComponent: () =>
          import('./features/details/details.component').then((c) => c.DetailsComponent),
        title: 'Details',
      },
      {
        path: 'review/:slug/:id',
        loadComponent: () =>
          import('./features/review/review.component').then((c) => c.ReviewComponent),
        title: 'Review',
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./shared/components/navbar/components/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent,
          ),
        title: 'Change Password',
      },
      {
        path: 'update-password',
        loadComponent: () =>
          import('./shared/components/navbar/components/update-data/update-data.component').then(
            (c) => c.UpdateDataComponent,
          ),
        title: 'Update User Data',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
    title: 'Error',
  },
];
