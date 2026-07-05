import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main-slider',
  imports: [CarouselModule],
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css',
})
export class MainSliderComponent implements OnInit {
  private readonly translateService = inject(TranslateService);
  ngOnInit(): void {
    this.onLangChange();
  }
  onLangChange(): void {
    this.translateService.onLangChange.subscribe({
      next: (res) => {
        this.mainSliderOptions = {
          ...this.mainSliderOptions,
          rtl: res.lang === 'ar',
        };
      },
    });
  }
  mainSliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    autoplaySpeed: 500,
    navText: ['', ''],
    items: 1,
    nav: false,
    rtl: this.translateService.getCurrentLang() === 'ar',
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
  };
}
