import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CategoriesData } from '../../../core/models/categories/categories-data.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly translateService = inject(TranslateService);
  categoriesList: WritableSignal<CategoriesData[]> = signal<CategoriesData[]>([]);
  ngOnInit(): void {
    this.onLangChange();
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
    });
  }
  onLangChange(): void {
    this.translateService.onLangChange.subscribe({
      next: (res) => {
        this.categoriesOptions = {
          ...this.categoriesOptions,
          rtl: res.lang === 'ar',
        };
      },
    });
  }
  categoriesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3500,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-arrow-left"></i>', '<i class="fa-solid fa-arrow-right"></i>'],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 4,
      },
      940: {
        items: 5,
      },
      1280: {
        items: 6,
      },
    },
    nav: false,
  };
}
