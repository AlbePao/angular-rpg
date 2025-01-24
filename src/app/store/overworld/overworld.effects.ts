import { inject } from '@angular/core';
import { DEFAULT_PERSON_ANIMATIONS } from '@lib/constants/person-animations';
import { GameContainer } from '@lib/services/game-container.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GameObjectsActions } from '@store/game-objects/game-objects.actions';
import { tap } from 'rxjs';
import { OverworldActions } from './overworld.actions';

export const initOverworld$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const gameContainer = inject(GameContainer);
    const store = inject(Store);

    return actions$.pipe(
      ofType(OverworldActions.init),
      tap(() => {
        const { gameCanvasContext } = gameContainer.containers;

        const image = new Image();
        image.onload = () => gameCanvasContext.drawImage(image, 0, 0);
        image.src = '/images/maps/DemoLower.png';

        store.dispatch(
          GameObjectsActions.setGameObjects({
            gameObjects: {
              hero: {
                x: 5,
                y: 6,
                src: '/images/characters/people/hero.png',
                hasShadow: true,
                animations: DEFAULT_PERSON_ANIMATIONS,
                currentAnimation: 'idleDown',
                currentAnimationFrame: 0,
              },
              beth: {
                x: 7,
                y: 9,
                src: '/images/characters/people/npc1.png',
                hasShadow: true,
                animations: DEFAULT_PERSON_ANIMATIONS,
                currentAnimation: 'idleDown',
                currentAnimationFrame: 0,
              },
            },
          }),
        );
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const OverworldEffects = {
  initOverworld$,
};
