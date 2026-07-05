import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AllordersResponse } from '../models/allorders.interface';

@Injectable({
  providedIn: 'root',
})
export class AllordersService {
  private readonly httpClient = inject(HttpClient);
  getUserOrders(userId: string | null): Observable<AllordersResponse> {
    return this.httpClient.get<AllordersResponse>(environment.base_url + `orders/user/${userId}`);
  }
}
