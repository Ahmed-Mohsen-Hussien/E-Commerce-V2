import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { WishlistDataResponse } from '../models/wishlist-data.interface';
import { WishlistResponse } from '../models/wishlist.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  wishlistCount: WritableSignal<number> = signal<number>(0);
  wishListIds: WritableSignal<string[]> = signal<string[]>([]);
  addToWishlist(productId: string): Observable<WishlistResponse> {
    return this.httpClient.post<WishlistResponse>(environment.base_url + 'wishlist', { productId });
  }
  getWishlistProducts(): Observable<WishlistDataResponse> {
    return this.httpClient.get<WishlistDataResponse>(environment.base_url + 'wishlist');
  }
  removeWishlistProduct(productId: string): Observable<any> {
    return this.httpClient.delete(environment.base_url + `wishlist/${productId}`);
  }
  getAllWishlistData(): void {
    this.getWishlistProducts().subscribe({
      next: (res) => {
        res.data.forEach((ele) => {
          this.wishListIds.set([...this.wishListIds(), ele._id]);
        });
      },
    });
  }
}
