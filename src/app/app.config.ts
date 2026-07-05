import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { routes } from './app.routes';
import { errorsInterceptor } from './core/interceptors/errors/errors-interceptor';
import { headersInterceptor } from './core/interceptors/headers/headers-interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading-interceptor';
import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([headersInterceptor, errorsInterceptor, loadingInterceptor]),
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ar',
      lang: 'en',
    }),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    provideToastr(),
  ],
};
