import { inject } from '@angular/core';
import { BASE_GRID_SIZE } from '@lib/constants/game-objects';
import { GameObjects, PersonAnimations } from '@lib/models/game-object';
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
            x: x * BASE_GRID_SIZE,
            y: y * BASE_GRID_SIZE,
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
      map(([, gameObjects, currentDirection]) => {
        const updatedGameObjects: GameObjects = { ...gameObjects };

        Object.keys(updatedGameObjects).forEach((key) => {
          const gameObject = { ...updatedGameObjects[key] };

          // TODO: extract following logic and concatenate it with sequential effects
          if (gameObject.type === 'person') {
            const {
              movingProgressRemaining,
              directionUpdate,
              direction,
              isPlayerControlled,
              currentAnimation,
              animationFrameLimit,
              currentAnimationFrame,
              animations,
            } = gameObject;

            // Update position
            if (movingProgressRemaining > 0) {
              const [axis, progression] = directionUpdate[direction];
              gameObject[axis] += progression;
              gameObject.movingProgressRemaining -= 1;
            }

            // Update sprite
            let key: PersonAnimations | null = null;

            if (isPlayerControlled && movingProgressRemaining === 0 && !currentDirection) {
              key = `idle-${direction}`;
            } else if (movingProgressRemaining > 0) {
              key = `walk-${direction}`;
            }

            if (key && currentAnimation !== key) {
              gameObject.currentAnimation = key;
              gameObject.currentAnimationFrame = 0;
              gameObject.animationFrameProgress = animationFrameLimit;
            }

            gameObject.currentFrameCoords = animations[currentAnimation][currentAnimationFrame];

            // Update game object data
            if (isPlayerControlled && movingProgressRemaining === 0 && currentDirection) {
              gameObject.direction = currentDirection;
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

export const updateAnimationProgress$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.updateGameObjects),
      map(({ gameObjects }) => {
        const updatedGameObjects: GameObjects = { ...gameObjects };

        Object.keys(updatedGameObjects).forEach((key) => {
          const gameObject = { ...updatedGameObjects[key] };

          if (gameObject.type === 'person') {
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
          }

          updatedGameObjects[key] = gameObject;
        });

        return GameObjectsActions.updateAnimationProgress({ gameObjects: updatedGameObjects });
      }),
    );
  },
  { functional: true },
);
