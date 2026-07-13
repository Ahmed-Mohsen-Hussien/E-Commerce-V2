import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CartDataResponse } from '../models/cart-data.interface';
import { CartProductsResponse } from '../models/cart-products.interface';
import { PaymentResponse } from '../models/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  cartListIds: WritableSignal<string[]> = signal<string[]>([]);
  cartCount: WritableSignal<number> = signal(0);
  addProductToCart(id: string): Observable<CartDataResponse> {
    return this.httpClient.post<CartDataResponse>(environment.base_url + 'cart', {
      productId: id,
    });
  }
  getCartItems(): Observable<CartProductsResponse> {
    return this.httpClient.get<CartProductsResponse>(environment.base_url + 'cart');
  }
  updateCartProductQuantity(
    productId: string,
    countNumber: number,
  ): Observable<CartProductsResponse> {
    return this.httpClient.put<CartProductsResponse>(environment.base_url + `cart/${productId}`, {
      count: countNumber,
    });
  }
  deleteItemFromCart(productId: string): Observable<CartProductsResponse> {
    return this.httpClient.delete<CartProductsResponse>(environment.base_url + `cart/${productId}`);
  }
  clearCartItems(): Observable<any> {
    return this.httpClient.delete<any>(environment.base_url + 'cart');
  }
  checkOutSession(cartId: string | null, shippingDetails: object): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>(
      environment.base_url +
        `orders/checkout-session/${cartId}?url=https://e-commerce-v2-ahmed-mohsen.vercel.app`,
      shippingDetails,
    );
  }
  creatCashOrder(cartId: string | null, shippingDetails: object): Observable<any> {
    return this.httpClient.post<any>(environment.base_url + `orders/${cartId}`, shippingDetails);
  }
  getCartProducts(): void {
    this.getCartItems().subscribe({
      next: (res) => {
        res.data.products.forEach((ele) => {
          this.cartListIds.set([...this.cartListIds(), ele.product._id]);
        });
      },
    });
  }
}
