import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesData } from '../../core/models/categories/categories-data.interface';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { delay, retry, tap } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  categoriesList: WritableSignal<CategoriesData[]> = signal<CategoriesData[]>([]);
  ngOnInit(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(retry(3))
      .subscribe({
        next: (res) => {
          this.categoriesList.set(res.data);
        },
      });
  }
  setCategoryId(id: string): void {
    this.productsService.categoryId = id;
  }
}
