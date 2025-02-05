import { inject } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { OverworldMapActions } from './overworld-map.actions';
import { selectOverworldMaps } from './overworld-map.selectors';

export const setCurrentMap$ = createEffect(
  (actions$ = inject(Actions), gameContainer = inject(GameContainer), store = inject(Store)) => {
    return actions$.pipe(
      ofType(OverworldMapActions.init, OverworldMapActions.setCurrentMap),
      concatLatestFrom(() => store.select(selectOverworldMaps)),
      tap(([{ currentMapId }, { maps }]) => {
        const { lowerSrc, upperSrc } = maps[currentMapId];

        // Set the lower and upper map images
        gameContainer.setMapImage({ lowerSrc, upperSrc });
      }),
    );
  },
  { dispatch: false, functional: true },
);
