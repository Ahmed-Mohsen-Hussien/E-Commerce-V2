import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsData } from './models/brands-data.interface';
import { BrandsService } from './services/brands.service';
import { PaginationInstance } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  brandList: WritableSignal<BrandsData[]> = signal<BrandsData[]>([]);
  hasMore: WritableSignal<boolean> = signal<boolean>(false);
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 40,
    currentPage: 1,
  };
  ngOnInit(): void {
    this.getBrandsData();
  }
  getBrandsData(): void {
    this.brandsService
      .getAllBrands(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.brandList.set([...this.brandList(), ...res.data]);
          this.numberOfPages = res.metadata.numberOfPages;
          if (this.pagination.currentPage >= this.numberOfPages) {
            this.hasMore.set(false);
            return;
          } else {
            this.hasMore.set(true);
          }
        },
      });
  }
  viewMore(): void {
    if (this.pagination.currentPage >= this.numberOfPages) {
      return;
    }
    this.pagination.currentPage++;
    this.getBrandsData();
  }
  setBrandId(id: string): void {
    this.productsService.brandId = id;
  }
}
