import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { STORE_PROVIDERS } from '@store/providers';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), ...STORE_PROVIDERS],
};
