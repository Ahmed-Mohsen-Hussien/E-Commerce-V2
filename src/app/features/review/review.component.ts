import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { ReviewsService } from '../../core/services/reviews/reviews.service';
import { ProductDetails } from '../products/models/product-details.interface';
import { AuthService } from './../../core/auth/services/auth.service';
import { Review } from '../details/models/product-reviews.interface';

@Component({
  selector: 'app-review',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly reviewsService = inject(ReviewsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  reviewForm!: FormGroup;
  productId: string | null = null;
  numberOfStars: number = 0;
  hoverStars: number = 0;
  isEditing: boolean = false;
  isDeleteModalOpen: boolean = false;
  productData: WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails);
  productReview: WritableSignal<Review> = signal<Review>({} as Review);
  allReviews: WritableSignal<Review[]> = signal<Review[]>([]);
  userId: string | null = null;
  ngOnInit(): void {
    this.isLoading.set(true);
    this.getProductId();
    this.getProductData();
    this.reviewFormInitialization();
    this.userId = this.authService.getUserId();
    this.getAllProductReviews();
  }
  getProductData(): void {
    this.productsService.getProductDetails(this.productId).subscribe({
      next: (res) => {
        this.productData.set(res.data);
      },
    });
  }
  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.productId = param.get('id');
      },
    });
  }
  reviewFormInitialization(): void {
    this.reviewForm = this.fb.group({
      review: [null, Validators.required],
      rating: [0],
    });
  }
  hoverOnStars(stars: number): void {
    this.hoverStars = stars;
  }
  leaveStars(): void {
    this.hoverStars = 0;
  }
  setStars(stars: number): void {
    this.numberOfStars = stars;
    this.reviewForm.patchValue({ rating: this.numberOfStars });
  }
  colorStars(stars: number): boolean {
    if (this.hoverStars) {
      return stars <= this.hoverStars;
    }
    return stars <= this.numberOfStars;
  }
  getAllProductReviews(): void {
    this.reviewsService.getProductReviews(this.productId).subscribe({
      next: (res) => {
        this.allReviews.set(res.data);
        this.isReviewed();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  onSubmitReviewForm(): void {
    if (this.reviewForm.valid && this.numberOfStars) {
      if (this.isEditing) {
        this.reviewsService
          .updateReview(this.productReview()._id, this.reviewForm.value)
          .subscribe({
            next: (res) => {
              this.closeEditing();
              this.productReview.set(res.data);
            },
          });
      } else {
        this.reviewsService.CreateProductReview(this.productId, this.reviewForm.value).subscribe({
          next: (res) => {
            this.productReview.set(res.data);
            this.reviewForm.reset();
            this.numberOfStars = 0;
          },
        });
      }
    }
  }
  isReviewed(): void {
    this.allReviews().forEach((ele) => {
      if (ele.user._id === this.userId) {
        this.productReview.set(ele);
      }
    });
    this.isLoading.set(false);
  }
  openEditing(): void {
    this.isEditing = true;
    this.numberOfStars = this.productReview().rating;
    this.reviewForm.patchValue({ review: this.productReview().review });
    this.reviewForm.patchValue({ rating: this.productReview().rating });
  }
  closeEditing(): void {
    this.isEditing = false;
  }
  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    document.body.style.overflow = '';
  }
  deleteMyReview(): void {
    this.reviewsService.deleteReview(this.productReview()._id).subscribe({
      next: (res) => {
        this.productReview.set({} as Review);
      },
    });
  }
}
