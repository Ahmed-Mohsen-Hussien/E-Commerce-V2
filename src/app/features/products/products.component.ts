import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { ProductsData } from '../../core/models/products/products-data.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { CartService } from '../cart/services/cart.service';
import { WishlistService } from '../wishlist/services/wishlist.service';
@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  productList: WritableSignal<ProductsData[]> = signal<ProductsData[]>([]);
  searchWord: string = '';
  pagination: PaginationInstance = {
    id: 'products',
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.wishlistService.wishListIds.set([]);
    this.cartService.cartListIds.set([]);
    this.getAllProductsData();
    this.wishlistService.getAllWishlistData();
    this.cartService.getCartProducts();
  }
  getAllProductsData(): void {
    this.productsService
      .getAllProducts(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.productsService.brandId,
        this.productsService.categoryId,
      )
      .subscribe({
        next: (res) => {
          this.productList.set(res.data);
          this.pagination.totalItems = res.results;
          this.productsService.brandId = '';
          this.productsService.categoryId = '';
        },
      });
  }
  pageChanged(page: number): void {
    this.pagination.currentPage = page;
    this.getAllProductsData();
  }
}
