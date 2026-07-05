import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UpdateDataService {
  private readonly httpClient = inject(HttpClient);
  updateData(data: object): Observable<any> {
    return this.httpClient.put<any>(environment.base_url + 'users/updateMe/', data);
  }
}
