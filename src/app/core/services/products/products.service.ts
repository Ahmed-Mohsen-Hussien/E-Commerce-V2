import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductsData, ProductsDataResponse } from '../../models/products/products-data.interface';
import { ProductDetailsResponse } from '../../../features/products/models/product-details.interface';
import { ProductReviewsResponse } from '../../../features/details/models/product-reviews.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  brandId: string = '';
  categoryId: string = '';
  getAllProducts(
    page: number = 1,
    limit: number = 10,
    brandId: string = '',
    categoryId: string = '',
  ): Observable<ProductsDataResponse> {
    if (brandId) {
      return this.httpClient.get<ProductsDataResponse>(
        environment.base_url + `products?page=${page}&limit=${limit}&brand=${brandId}`,
      );
    } else if (categoryId) {
      return this.httpClient.get<ProductsDataResponse>(
        environment.base_url + `products?page=${page}&limit=${limit}&category=${categoryId}`,
      );
    } else {
      return this.httpClient.get<ProductsDataResponse>(
        environment.base_url + `products?page=${page}&limit=${limit}`,
      );
    }
  }
  getProductDetails(id: string | null): Observable<ProductDetailsResponse> {
    return this.httpClient.get<ProductDetailsResponse>(environment.base_url + `products/${id}`);
  }
}
