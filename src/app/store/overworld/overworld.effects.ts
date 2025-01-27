import { inject } from '@angular/core';
import { OVERWORLD_MAPS } from '@lib/constants/overworld-maps';
import { GameContainer } from '@lib/services/game-container.service';
import { WINDOW } from '@lib/tokens/window';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GameObjectsActions } from '@store/game-objects/game-objects.actions';
import { OverworldMapActions } from '@store/overworld-map/overworld-map.actions';
import { tap } from 'rxjs';
import { OverworldActions } from './overworld.actions';

export const initOverworld$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldActions.init),
      tap(() => store.dispatch(OverworldMapActions.init({ maps: OVERWORLD_MAPS, currentMapId: 'Kitchen' }))),
    );
  },
  { dispatch: false, functional: true },
);

export const startGameLoop$ = createEffect(
  (
    actions$ = inject(Actions),
    gameContainer = inject(GameContainer),
    store = inject(Store),
    window = inject(WINDOW),
  ) => {
    return actions$.pipe(
      ofType(OverworldActions.startGameLoop),
      tap(() => {
        const step = () => {
          // Clear off the canvas
          gameContainer.clearCanvas();

          // Draw Lower layer
          // store.dispatch(OverworldMapActions.drawLowerMapLayer());

          // Draw current map
          store.dispatch(OverworldMapActions.drawCurrentMap());

          // Draw Game Objects
          store.dispatch(GameObjectsActions.drawGameObjects());

          // Draw Upper layer
          // store.dispatch(OverworldMapActions.drawUpperMapLayer());

          window.requestAnimationFrame(() => {
            step();
          });
        };
        step();
      }),
    );
  },
  { dispatch: false, functional: true },
);
