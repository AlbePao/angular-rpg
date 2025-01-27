import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { GameObjectsActions } from './game-objects.actions';
import { selectGameObjects } from './game-objects.selectors';

export const setGameObjects$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.setGameObjects),
      tap(({ gameObjects }) =>
        Object.keys(gameObjects).forEach((key) => gameContainer.setGameObjectImage(gameObjects[key])),
      ),
    );
  },
  { dispatch: false, functional: true },
);

export const drawGameObjects$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer), store = inject(Store)) => {
    return actions$.pipe(
      ofType(GameObjectsActions.drawGameObjects),
      concatLatestFrom(() => store.select(selectGameObjects)),
      tap(([, gameObjects]) =>
        Object.keys(gameObjects).forEach((key) => gameContainer.drawGameObject(gameObjects[key])),
      ),
    );
  },
  { dispatch: false, functional: true },
);
