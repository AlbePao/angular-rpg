import { inject } from '@angular/core';
import { PERSON_DIRECTION_UPDATE } from '@lib/constants/person-direction-update';
import { GameObjects } from '@lib/models/game-object';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectDirection } from '@store/direction-input/direction-input.selectors';
import { OverworldMapActions } from '@store/overworld-map/overworld-map.actions';
import { selectOverworldMaps } from '@store/overworld-map/overworld-map.selectors';
import { OverworldActions } from '@store/overworld/overworld.actions';
import { map, tap } from 'rxjs';
import { GameObjectsActions } from './game-objects.actions';
import { selectGameObjects } from './game-objects.selectors';

export const setGameObjects$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMap),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      map(([{ currentMapId }, { maps }]) => {
        const { gameObjects } = maps[currentMapId];

        return Object.keys(gameObjects).reduce<GameObjects>((prev, curr) => {
          const currentGameObject = gameObjects[curr];
          const { x, y } = currentGameObject;

          // Attach the grid size to game object x and y coordinates
          const gameObject = {
            ...currentGameObject,
            x: x * 16, // TODO: extract in a constant
            y: y * 16, // TODO: extract in a constant
          };

          return { ...prev, [curr]: gameObject };
        }, {});
      }),
      // Set the game objects for the current map
      tap((gameObjects) =>
        Object.keys(gameObjects).forEach((key) => gameContainer.setGameObjectImage(gameObjects[key])),
      ),
      map((gameObjects) => GameObjectsActions.setGameObjects({ gameObjects })),
    );
  },
  { functional: true },
);

export const updatePosition$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldActions.drawObjects),
      concatLatestFrom(() => [store.select(selectGameObjects), store.select(selectDirection)]),
      map(([, gameObjects, gameObjectDirection]) => {
        const updatedGameObjects: GameObjects = { ...gameObjects };

        Object.keys(updatedGameObjects).forEach((key) => {
          const gameObject = { ...updatedGameObjects[key] };

          if (gameObject.type === 'person') {
            if (gameObject.movingProgressRemaining > 0) {
              const [axis, progression] = PERSON_DIRECTION_UPDATE[gameObject.direction];
              gameObject[axis] += progression;
              gameObject.movingProgressRemaining -= 1;
            }

            if (gameObject.isPlayerControlled && gameObject.movingProgressRemaining === 0 && gameObjectDirection) {
              gameObject.direction = gameObjectDirection;
              gameObject.movingProgressRemaining = 16;
            }
          }

          updatedGameObjects[key] = gameObject;
        });

        return GameObjectsActions.updateGameObjects({ gameObjects: updatedGameObjects });
      }),
    );
  },
  { functional: true },
);
