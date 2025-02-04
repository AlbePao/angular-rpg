import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { GameObjectsActions } from '@store/game-objects/game-objects.actions';
import { tap } from 'rxjs';
import { OverworldMapActions } from './overworld-map.actions';
import { selectOverworldMaps } from './overworld-map.selectors';

export const setCurrentMap$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMap),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      tap(([{ currentMapId }, { maps }]) => {
        const { gameObjects, lowerSrc, upperSrc } = maps[currentMapId];

        // Set the lower and upper map images
        gameContainer.setMapImage({ lowerSrc, upperSrc });

        // Draw the current map
        store.dispatch(OverworldMapActions.drawCurrentMap());

        // Set the game objects for the current map
        store.dispatch(GameObjectsActions.setGameObjects({ gameObjects }));

        // Draw map game objects
        store.dispatch(GameObjectsActions.drawGameObjects());
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const drawCurrentMap$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.drawCurrentMap),
      tap(() => gameContainer.drawMapImage()),
    );
  },
  { dispatch: false, functional: true },
);
