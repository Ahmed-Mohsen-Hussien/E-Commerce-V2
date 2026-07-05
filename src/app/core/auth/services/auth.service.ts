import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserDataResponse } from '../models/user-data.interface';
import { jwtDecode } from 'jwt-decode';
import { STORED_KEYS } from '../../constants/storedKeys';
import { Router } from '@angular/router';
import { LoggedUserDataResponse } from '../models/logged-user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  decoded: any = null;
  sendRegisterData(registerData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(
      environment.base_url + 'auth/signup',
      registerData,
    );
  }
  sendLoginData(loginData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'auth/signin', loginData);
  }
  getUserId(): any {
    const token = localStorage.getItem(STORED_KEYS.userToken);
    if (token) {
      this.decoded = jwtDecode(token);
      return this.decoded.id;
    }
  }
  forgetLoginPassword(userEmail: string): Observable<any> {
    return this.httpClient.post<any>(environment.base_url + 'auth/forgotPasswords', {
      email: userEmail,
    });
  }
  verifyResetCode(code: string): Observable<any> {
    return this.httpClient.post(environment.base_url + 'auth/verifyResetCode', {
      resetCode: code,
    });
  }
  resetPassword(passwordForm: object): Observable<any> {
    return this.httpClient.put<any>(environment.base_url + 'auth/resetPassword', passwordForm);
  }
  getUserData(userId: string | null): Observable<LoggedUserDataResponse> {
    return this.httpClient.get<LoggedUserDataResponse>(
      environment.base_url + `users?_id=${userId}`,
    );
  }
  signOut(): void {
    localStorage.removeItem(STORED_KEYS.userToken);
    this.router.navigate(['/login']);
  }
}
