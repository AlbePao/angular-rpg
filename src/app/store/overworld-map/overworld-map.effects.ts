import { inject } from '@angular/core';
import { CameraOffset } from '@lib/models/camera-offset';
import { GameCanvas } from '@lib/services/game-canvas.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { tap } from 'rxjs';
import { OverworldMapActions } from './overworld-map.actions';
import { selectCameraPersonId, selectOverworldMaps } from './overworld-map.selectors';

export const drawObjects$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), gameCanvas = inject(GameCanvas)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.drawObjects),
      concatLatestFrom(() => [store.select(selectGameObjects), store.select(selectCameraPersonId)]),
      tap(([, gameObjects, cameraPersonId]) => {
        // Get the camera person offset
        const { x: offsetX, y: offsetY } = gameObjects[cameraPersonId];
        const cameraOffset: CameraOffset = { offsetX, offsetY };

        // Clear off the canvas
        gameCanvas.clearCanvas();

        // Draw lower layer
        gameCanvas.drawLowerMapLayer(cameraOffset);

        // Draw game objects
        Object.keys(gameObjects).forEach((key) => gameCanvas.drawGameObject(gameObjects[key], cameraOffset));

        // Draw upper layer
        gameCanvas.drawUpperMapLayer(cameraOffset);
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const setCurrentMap$ = createEffect(
  (actions$ = inject(Actions), gameCanvas = inject(GameCanvas), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMap),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      tap(([{ currentMapId }, { maps }]) => {
        const { lowerSrc, upperSrc } = maps[currentMapId];

        // Set the lower and upper map images
        gameCanvas.setMapImage({ lowerSrc, upperSrc });
      }),
    );
  },
  { dispatch: false, functional: true },
);
