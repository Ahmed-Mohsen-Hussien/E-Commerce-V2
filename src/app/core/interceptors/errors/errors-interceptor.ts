import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const plat_id = inject(PLATFORM_ID);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isPlatformBrowser(plat_id)) {
        toastr.error(err.error.message, 'FreshCart');
      }
      return throwError(() => err);
    }),
  );
};
