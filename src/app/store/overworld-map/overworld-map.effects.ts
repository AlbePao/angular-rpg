import { inject } from '@angular/core';
import { BASE_GRID_SIZE } from '@lib/constants/game-objects';
import { FALLBACK_MAP } from '@lib/constants/overworld-maps';
import { CameraOffset } from '@lib/models/camera-offset';
import { OverworldMapWalls } from '@lib/models/overworld-map';
import { GameCanvas } from '@lib/services/game-canvas.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { GameObjectsActions } from '@store/game-objects/game-objects.actions';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { map, tap } from 'rxjs';
import { OverworldMapActions } from './overworld-map.actions';
import { selectCameraPersonId, selectOverworldMaps } from './overworld-map.selectors';

export const drawObjects = createEffect(
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

export const setCurrentMap = createEffect(
  (actions$ = inject(Actions), gameCanvas = inject(GameCanvas), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMapById),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      map(([{ currentMapId }, maps]) => {
        // Set fallback map if no mapId is provided
        currentMapId = currentMapId || FALLBACK_MAP;
        const currentMap = maps[currentMapId];

        // Map walls with grid size coordinates
        const walls = Object.keys(currentMap.walls).reduce<OverworldMapWalls>((prev, curr) => {
          const [x, y] = curr.split(',').map((coord) => parseInt(coord));
          const updatedCoords = `${x * BASE_GRID_SIZE},${y * BASE_GRID_SIZE}`;
          return { ...prev, [updatedCoords]: true };
        }, {});

        return { ...currentMap, walls };
      }),
      // Set the lower and upper map images
      tap(({ lowerSrc, upperSrc }) => gameCanvas.setMapImage({ lowerSrc, upperSrc })),
      map((currentMap) => OverworldMapActions.setCurrentMap({ currentMap })),
    );
  },
  { functional: true },
);

// Update game objects walls inside the map
export const updateGameObjectWalls = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.updateGameObjects),
      map(({ gameObjects }) => {
        // Game object walls are constantly overwritten by game loop, so thats why we need to store it inside another property in overworld map state
        const gameObjectWalls = Object.keys(gameObjects).reduce<OverworldMapWalls>((prev, curr) => {
          const currentGameObject = gameObjects[curr];
          const { x, y } = currentGameObject;

          return { ...prev, [`${x},${y}`]: true };
        }, {});

        return OverworldMapActions.updateGameObjectWalls({ gameObjectWalls });
      }),
    );
  },
  { functional: true },
);
