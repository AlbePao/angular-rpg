import { inject } from '@angular/core';
import { GameObjects } from '@lib/models/game-object';
import { PersonAnimations } from '@lib/models/game-object-person';
import { GameCanvas } from '@lib/services/game-canvas.service';
import { Utils } from '@lib/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectDirection } from '@store/direction-input/direction-input.selectors';
import { OverworldMapActions } from '@store/overworld-map/overworld-map.actions';
import { selectCurrentMapWalls, selectOverworldMaps } from '@store/overworld-map/overworld-map.selectors';
import { map, tap } from 'rxjs';
import { GameObjectsActions } from './game-objects.actions';
import { selectGameObjects } from './game-objects.selectors';

export const setGameObjects = createEffect(
  (actions$ = inject(Actions), gameCanvas = inject(GameCanvas), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMapById),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      map(([{ currentMapId }, maps]) => {
        const { gameObjects } = maps[currentMapId];

        return Object.keys(gameObjects).reduce<GameObjects>((prev, curr) => {
          const currentGameObject = gameObjects[curr];
          const { x, y } = currentGameObject;

          // Attach the grid size to game object x and y coordinates
          const gameObject = {
            ...currentGameObject,
            x: Utils.withGrid(x),
            y: Utils.withGrid(y),
          };

          return { ...prev, [curr]: gameObject };
        }, {});
      }),
      // Set the game objects for the current map
      tap((gameObjects) => Object.keys(gameObjects).forEach((key) => gameCanvas.setGameObjectImage(gameObjects[key]))),
      map((gameObjects) => GameObjectsActions.setGameObjects({ gameObjects })),
    );
  },
  { functional: true },
);

export const updatePosition = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.drawObjects),
      concatLatestFrom(() => [
        store.select(selectGameObjects),
        store.select(selectDirection),
        store.select(selectCurrentMapWalls),
      ]),
      map(([, gameObjects, currentDirection, currentMapWalls]) => {
        return Object.keys(gameObjects).reduce<GameObjects>((prev, currKey) => {
          const gameObject = { ...gameObjects[currKey] };

          // TODO: extract following logic and concatenate it with sequential effects
          if (Utils.isGameObjectPerson(gameObject)) {
            const {
              x,
              y,
              movingProgressRemaining,
              directionUpdate,
              direction,
              isPlayerControlled,
              currentAnimation,
              animationFrameLimit,
            } = gameObject;

            if (movingProgressRemaining > 0) {
              // Update position
              const [axis, progression] = directionUpdate[direction];
              gameObject[axis] += progression;
              gameObject.movingProgressRemaining -= 1;

              return { ...prev, [currKey]: gameObject };
            }

            // More cases for starting to walk will come here
            //
            //

            // Case: We're keyboard ready and have an arrow pressed
            if (isPlayerControlled && currentDirection) {
              gameObject.direction = currentDirection;

              const isSpaceTaken = Utils.isSpaceTaken(x, y, currentDirection, currentMapWalls);

              // TODO: add if (behavior.type === 'walk')
              if (!isSpaceTaken) {
                gameObject.movingProgressRemaining = 16;
              }
            }

            // Update sprite
            let key: PersonAnimations | null = null;

            if (gameObject.movingProgressRemaining > 0) {
              key = `walk-${gameObject.direction}`;
            } else {
              key = `idle-${gameObject.direction}`;
            }

            if (key && currentAnimation !== key) {
              gameObject.currentAnimation = key;
              gameObject.currentAnimationFrame = 0;
              gameObject.animationFrameProgress = animationFrameLimit;
            }
            // End update sprite
          }

          return { ...prev, [currKey]: gameObject };
        }, {});
      }),
      map((gameObjects) => GameObjectsActions.updateGameObjects({ gameObjects })),
    );
  },
  { functional: true },
);

export const updateAnimationProgress = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.updateGameObjects),
      map(({ gameObjects }) => {
        return Object.keys(gameObjects).reduce<GameObjects>((prev, currKey) => {
          const gameObject = { ...gameObjects[currKey] };
          const { animationFrameProgress, currentAnimation, animationFrameLimit, currentAnimationFrame, animations } =
            gameObject;

          // Downtick frame progress
          if (animationFrameProgress > 0) {
            gameObject.animationFrameProgress -= 1;
          } else {
            // Reset the counter
            gameObject.animationFrameProgress = animationFrameLimit;

            const nextAnimation = animations[currentAnimation][currentAnimationFrame + 1];

            if (nextAnimation) {
              gameObject.currentAnimationFrame += 1;
            } else {
              gameObject.currentAnimationFrame = 0;
            }
          }

          return { ...prev, [currKey]: gameObject };
        }, {});
      }),
      map((gameObjects) => GameObjectsActions.updateAnimationProgress({ gameObjects })),
    );
  },
  { functional: true },
);
