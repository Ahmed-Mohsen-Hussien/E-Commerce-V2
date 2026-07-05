import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartProducts } from './models/cart-products.interface';
import { CartService } from './services/cart.service';
import { STORED_KEYS } from '../../core/constants/storedKeys';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly plat_id = inject(PLATFORM_ID);
  cartItems: WritableSignal<CartProducts> = signal<CartProducts>({} as CartProducts);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      const token = localStorage.getItem(STORED_KEYS.userToken);
      if (token) {
        this.getCartProducts();
      }
    }
    this.isLoading.set(true);
  }
  getCartProducts(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status === 'success') {
          this.cartItems.set(res.data);
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  updateCartProduct(id: string, count: number): void {
    this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartItems.set(res.data);
        }
      },
    });
  }
  deleteFromCart(id: string): void {
    this.cartService.deleteItemFromCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success('Product removed successfully to your cart', 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
          this.cartItems.set(res.data);
        }
      },
    });
  }
  clearCart(): void {
    this.cartService.clearCartItems().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartService.cartCount.set(0);
          this.getCartProducts();
        }
      },
    });
  }
}
