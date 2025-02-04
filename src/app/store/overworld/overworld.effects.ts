import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { tap } from 'rxjs';
import { OverworldActions } from './overworld.actions';

export const drawObjects$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), gameContainer = inject(GameContainer)) => {
    return actions$.pipe(
      ofType(OverworldActions.drawObjects),
      concatLatestFrom(() => store.select(selectGameObjects)),
      tap(([, gameObjects]) => {
        // Clear off the canvas
        gameContainer.clearCanvas();

        // Draw lower layer
        gameContainer.drawLowerMapLayer();

        // Draw game objects
        Object.keys(gameObjects).forEach((key) => gameContainer.drawGameObject(gameObjects[key]));

        // Draw upper layer
        gameContainer.drawUpperMapLayer();
      }),
    );
  },
  { dispatch: false, functional: true },
);
