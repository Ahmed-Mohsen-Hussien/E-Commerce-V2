import { DecimalPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsData } from '../../../core/models/products/products-data.interface';
import { CartService } from '../../../features/cart/services/cart.service';
import { SplitPipe } from '../../pipes/split-pipe';
import { WishlistService } from './../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, SplitPipe, DecimalPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() data: ProductsData = {} as ProductsData;
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  addProductItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
          this.cartService.cartListIds.set([...this.cartService.cartListIds(), this.data._id]);
        }
      },
    });
  }
  removeProductFromCart(id: string): void {
    this.cartService.deleteItemFromCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success('Product removed successfully to your cart', 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
          this.cartService.cartListIds.update((curr) =>
            curr.filter((item) => item != this.data.id),
          );
        }
      },
    });
  }
  addProductToWishlist(id: string): void {
    this.wishlistService.addToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.getWishlistCount();
          this.wishlistService.wishListIds.set([
            ...this.wishlistService.wishListIds(),
            this.data._id,
          ]);
        }
      },
    });
  }
  removeProductFromWishlist(id: string): void {
    this.wishlistService.removeWishlistProduct(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.getWishlistCount();
          this.wishlistService.wishListIds.update((curr) =>
            curr.filter((item) => item != this.data.id),
          );
        }
      },
    });
  }
  getWishlistCount(): void {
    this.wishlistService.getWishlistProducts().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count);
      },
    });
  }
  isWishListed(): boolean {
    return this.wishlistService.wishListIds().includes(this.data._id);
  }
  isInCart(): boolean {
    return this.cartService.cartListIds().includes(this.data._id);
  }
}
