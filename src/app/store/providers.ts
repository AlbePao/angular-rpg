import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as DirectionInput from './direction-input/direction-input.effects';
import { DirectionInputFeatureKey, directionInputReducer } from './direction-input/direction-input.state';
import * as GameObjectsEffects from './game-objects/game-objects.effects';
import { GameObjectsFeatureKey, gameObjectsReducer } from './game-objects/game-objects.state';
import * as OverworldMapEffects from './overworld-map/overworld-map.effects';
import { OverworldMapFeatureKey, overworldMapReducer } from './overworld-map/overworld-map.state';

export const STORE_PROVIDERS = [
  provideStore(
    {
      [DirectionInputFeatureKey]: directionInputReducer,
      [GameObjectsFeatureKey]: gameObjectsReducer,
      [OverworldMapFeatureKey]: overworldMapReducer,
    },
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
    // Functional effects
    GameObjectsEffects,
    DirectionInput,
    OverworldMapEffects,
  ]),
];
