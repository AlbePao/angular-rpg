import { inject } from '@angular/core';
import { GameContainerService } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { OverworldActions } from './overworld.actions';

const overworldInit$ = createEffect(
  (actions$ = inject(Actions), gameContainerService = inject(GameContainerService)) => {
    return actions$.pipe(
      ofType(OverworldActions.init),
      tap(() => {
        const { gameCanvasContext } = gameContainerService.containers;

        const image = new Image();
        image.onload = () => gameCanvasContext.drawImage(image, 0, 0);
        image.src = '/images/maps/DemoLower.png';

        const x = 5;
        const y = 6;

        const shadow = new Image();
        shadow.onload = () =>
          gameCanvasContext.drawImage(
            shadow,
            0, //left cut
            0, //top cut,
            32, //width of cut
            32, //height of cut
            x * 16 - 8,
            y * 16 - 18,
            32,
            32,
          );

        shadow.src = '/images/characters/shadow.png';

        const hero = new Image();
        hero.onload = () =>
          gameCanvasContext.drawImage(
            hero,
            0, //left cut
            0, //top cut,
            32, //width of cut
            32, //height of cut
            x * 16 - 8,
            y * 16 - 18,
            32,
            32,
          );
        hero.src = '/images/characters/people/hero.png';
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const OverworldEffects = {
  overworldInit$,
};
