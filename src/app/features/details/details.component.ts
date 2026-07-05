import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductDetails } from '../products/models/product-details.interface';
import { CartService } from '../cart/services/cart.service';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistData } from '../wishlist/models/wishlist-data.interface';
import { Review } from './models/product-reviews.interface';
import { DatePipe } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ReviewsService } from '../../core/services/reviews/reviews.service';

@Component({
  selector: 'app-details',
  imports: [DatePipe, CarouselModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly reviewsService = inject(ReviewsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  wishListProducts: WritableSignal<WishlistData[]> = signal<WishlistData[]>([]);
  productData: WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails);
  productReviews: WritableSignal<Review[]> = signal<Review[]>([]);
  productId: string | null = null;
  ngOnInit(): void {
    this.wishlistService.wishListIds.set([]);
    this.cartService.cartListIds.set([]);
    this.getProductId();
    this.getProductDetailsData();
    this.wishlistService.getAllWishlistData();
    this.cartService.getCartProducts();
    this.getProductAllReviews();
  }
  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
      },
    });
  }
  getProductDetailsData(): void {
    this.productsService.getProductDetails(this.productId).subscribe({
      next: (res) => {
        this.productData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProductItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
          this.cartService.cartListIds.set([
            ...this.cartService.cartListIds(),
            this.productData()._id,
          ]);
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
            curr.filter((item) => item != this.productId),
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
            this.productData()._id,
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
            curr.filter((item) => item != this.productData()._id),
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
    return this.wishlistService.wishListIds().includes(this.productId!);
  }
  isInCart(): boolean {
    return this.cartService.cartListIds().includes(this.productId!);
  }
  getProductAllReviews(): void {
    this.reviewsService.getProductReviews(this.productId).subscribe({
      next: (res) => {
        this.productReviews.set(res.data);
      },
    });
  }
  productDetailsOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-arrow-left"></i>', '<i class="fa-solid fa-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1280: {
        items: 1,
      },
    },
    nav: true,
  };
  setBrandId(id: string): void {
    this.productsService.brandId = id;
  }
}
