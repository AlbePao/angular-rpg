import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { GameObjectsActions } from './game-objects.actions';

export const setGameObjects$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const store = inject(Store);

    return actions$.pipe(
      ofType(GameObjectsActions.setGameObjects),
      tap(({ gameObjects }) => {
        Object.keys(gameObjects).forEach((key) =>
          store.dispatch(GameObjectsActions.drawGameObject({ gameObject: gameObjects[key] })),
        );
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const drawGameObject$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const gameContainer = inject(GameContainer);

    return actions$.pipe(
      ofType(GameObjectsActions.drawGameObject),
      tap(({ gameObject }) => {
        const { gameCanvasContext } = gameContainer.containers;
        const x = gameObject.x * 16 - 8;
        const y = gameObject.y * 16 - 18;

        if (gameObject.hasShadow) {
          const shadow = new Image();
          shadow.onload = () => gameCanvasContext.drawImage(shadow, x, y);
          shadow.src = '/images/characters/shadow.png';
        }

        const image = new Image();
        image.onload = () => gameCanvasContext.drawImage(image, 0, 0, 32, 32, x, y, 32, 32);
        image.src = gameObject.src;
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const GameObjectsEffects = {
  setGameObjects$,
  drawGameObject$,
};
