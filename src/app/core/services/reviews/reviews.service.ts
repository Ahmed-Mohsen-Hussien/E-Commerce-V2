import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductReviewsResponse } from '../../../features/details/models/product-reviews.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly httpClient = inject(HttpClient);
  getProductReviews(productId: string | null): Observable<ProductReviewsResponse> {
    return this.httpClient.get<ProductReviewsResponse>(
      environment.base_url + `products/${productId}/reviews`,
    );
  }
  CreateProductReview(productId: string | null, data: object): Observable<any> {
    return this.httpClient.post(environment.base_url + `products/${productId}/reviews`, data);
  }
  updateReview(reviewId: string, newData: object): Observable<any> {
    return this.httpClient.put<any>(environment.base_url + `reviews/${reviewId}`, newData);
  }
  deleteReview(reviewId: string): Observable<any> {
    return this.httpClient.delete(environment.base_url + `reviews/${reviewId}`);
  }
}
