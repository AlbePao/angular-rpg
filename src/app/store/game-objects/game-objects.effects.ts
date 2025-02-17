import { inject } from '@angular/core';
import { PERSON_DIRECTION_UPDATES } from '@lib/constants/game-object-person';
import { BASE_ANIMATION_FRAME_LIMIT } from '@lib/constants/game-objects';
import { GameObjects } from '@lib/models/game-object';
import { PersonAnimations } from '@lib/models/game-object-person';
import { GameCanvas } from '@lib/services/game-canvas.service';
import { Utils } from '@lib/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectDirection } from '@store/direction-input/direction-input.selectors';
import { OverworldMapActions } from '@store/overworld-map/overworld-map.actions';
import {
  selectCurrentMapWalls,
  selectIsCutscenePlaying,
  selectOverworldMaps,
} from '@store/overworld-map/overworld-map.selectors';
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

export const updatePositions = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.drawObjects),
      concatLatestFrom(() => [
        store.select(selectGameObjects),
        store.select(selectDirection),
        store.select(selectCurrentMapWalls),
        store.select(selectIsCutscenePlaying),
      ]),
      map(([{ deltaTime }, gameObjects, currentDirection, currentMapWalls, isCutscenePlaying]) => {
        return Object.keys(gameObjects).reduce<GameObjects>((prev, currKey) => {
          const gameObject = { ...gameObjects[currKey] };

          if (Utils.isGameObjectPerson(gameObject)) {
            const {
              x,
              y,
              movingProgressRemaining,
              behaviorLoop,
              behaviorLoopIndex,
              direction,
              isPlayerControlled,
              currentAnimation,
            } = gameObject;

            if (movingProgressRemaining > 0) {
              // Update position
              const [axis, progression] = PERSON_DIRECTION_UPDATES[direction];
              gameObject[axis] += progression;
              gameObject.movingProgressRemaining -= 1;

              return { ...prev, [currKey]: gameObject };
            }

            // We're keyboard ready and have an arrow pressed
            if (!isCutscenePlaying && isPlayerControlled && currentDirection) {
              gameObject.direction = currentDirection;

              const isSpaceTaken = Utils.isSpaceTaken(x, y, currentDirection, currentMapWalls);

              if (!isSpaceTaken) {
                gameObject.movingProgressRemaining = 16;
              }
            }

            // If person has a behavior loop, use it
            if (behaviorLoop.length > 0) {
              // Get current behavior
              const currentBehavior = behaviorLoop[behaviorLoopIndex];

              // Increase elapsed behavior time
              gameObject.currentBehaviorTimeElapsed += deltaTime;

              if (currentBehavior.type === 'walk') {
                const { direction } = currentBehavior;

                if (gameObject.movingProgressRemaining > 0) {
                  // Update position
                  const [axis, progression] = PERSON_DIRECTION_UPDATES[direction];
                  gameObject[axis] += progression;
                  gameObject.movingProgressRemaining -= 1;

                  return { ...prev, [currKey]: gameObject };
                }

                const isSpaceTaken = Utils.isSpaceTaken(x, y, direction, currentMapWalls);

                if (!isSpaceTaken) {
                  gameObject.movingProgressRemaining = 16;
                  // Behavior time is over, so we change change behavior and reset the timer
                  gameObject.behaviorLoopIndex += 1;

                  // If we reach the end of behaviors list, behavior loop index is reset
                  if (gameObject.behaviorLoopIndex === behaviorLoop.length) {
                    gameObject.behaviorLoopIndex = 0;
                  }

                  // Get next behavior
                  gameObject.direction = direction;
                  gameObject.currentAnimation = `walk-${direction}`;
                  gameObject.currentBehaviorTimeElapsed = 0;
                } else {
                  gameObject.currentAnimation = `stand-${direction}`;
                }
              }

              if (currentBehavior.type === 'stand') {
                const { direction, time } = currentBehavior;

                if (gameObject.currentBehaviorTimeElapsed > time) {
                  // Behavior time is over, so we change change behavior and reset the timer
                  gameObject.behaviorLoopIndex += 1;

                  // If we reach the end of behaviors list, behavior loop index is reset
                  if (gameObject.behaviorLoopIndex === behaviorLoop.length) {
                    gameObject.behaviorLoopIndex = 0;
                  }

                  gameObject.direction = direction;
                  gameObject.currentAnimation = `stand-${direction}`;
                  gameObject.currentBehaviorTimeElapsed = 0;
                } else {
                  gameObject.currentAnimation = `stand-${direction}`;
                }
              }

              return { ...prev, [currKey]: gameObject };
            }

            // Update sprite
            let key: PersonAnimations | null = null;

            if (gameObject.movingProgressRemaining > 0) {
              key = `walk-${gameObject.direction}`;
            } else {
              key = `stand-${gameObject.direction}`;
            }

            if (key && currentAnimation !== key) {
              gameObject.currentAnimation = key;
              gameObject.currentAnimationFrame = 0;
              gameObject.animationFrameProgress = BASE_ANIMATION_FRAME_LIMIT;
            }
            // End update sprite
          }

          return { ...prev, [currKey]: gameObject };
        }, {});
      }),
      map((gameObjects) => GameObjectsActions.updatePositions({ gameObjects })),
    );
  },
  { functional: true },
);

export const updateAnimationsProgress = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.updatePositions),
      map(({ gameObjects }) => {
        return Object.keys(gameObjects).reduce<GameObjects>((prev, currKey) => {
          const gameObject = { ...gameObjects[currKey] };
          const { animationFrameProgress, currentAnimation, currentAnimationFrame, animations } = gameObject;

          // Downtick frame progress
          if (animationFrameProgress > 0) {
            gameObject.animationFrameProgress -= 1;
          } else {
            // Reset the counter
            gameObject.animationFrameProgress = BASE_ANIMATION_FRAME_LIMIT;

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
      map((gameObjects) => GameObjectsActions.updateAnimationsProgress({ gameObjects })),
    );
  },
  { functional: true },
);
