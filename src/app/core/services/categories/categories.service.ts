import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CategoriesDataResponse } from '../../models/categories/categories-data.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  getAllCategories(): Observable<CategoriesDataResponse> {
    return this.httpClient.get<CategoriesDataResponse>(environment.base_url + 'categories');
  }
}
