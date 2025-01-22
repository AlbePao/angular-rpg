import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { OverworldEffects } from './overworld/overworld.effects';

export const STORE_PROVIDERS = [
  provideStore(
    {},
    {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionTypeUniqueness: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    },
  ),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
  }),
  provideEffects([
    //functional effects
    OverworldEffects,
  ]),
];
