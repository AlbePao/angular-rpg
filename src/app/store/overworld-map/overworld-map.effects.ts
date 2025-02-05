import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { tap } from 'rxjs';
import { OverworldMapActions } from './overworld-map.actions';
import { selectCameraPersonId, selectOverworldMaps } from './overworld-map.selectors';

export const drawObjects$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), gameContainer = inject(GameContainer)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.drawObjects),
      concatLatestFrom(() => [store.select(selectGameObjects), store.select(selectCameraPersonId)]),
      tap(([, gameObjects, cameraPersonId]) => {
        // Get the camera person offset
        const { x, y } = gameObjects[cameraPersonId];
        const cameraOffset = { x, y };

        // Clear off the canvas
        gameContainer.clearCanvas();

        // Draw lower layer
        gameContainer.drawLowerMapLayer(cameraOffset);

        // Draw game objects
        Object.keys(gameObjects).forEach((key) => gameContainer.drawGameObject(gameObjects[key], cameraOffset));

        // Draw upper layer
        gameContainer.drawUpperMapLayer(cameraOffset);
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const setCurrentMap$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMap),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      tap(([{ currentMapId }, { maps }]) => {
        const { lowerSrc, upperSrc } = maps[currentMapId];

        // Set the lower and upper map images
        gameContainer.setMapImage({ lowerSrc, upperSrc });
      }),
    );
  },
  { dispatch: false, functional: true },
);
