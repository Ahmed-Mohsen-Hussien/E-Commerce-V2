import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { ProductsData } from '../../../core/models/products/products-data.interface';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent, RouterLink],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css',
})
export class PopularProductsComponent {
  private readonly productsService = inject(ProductsService);
  productList: WritableSignal<ProductsData[]> = signal<ProductsData[]>([]);
  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
    });
  }
}
