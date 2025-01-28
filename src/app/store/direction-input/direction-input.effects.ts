import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { GameObjectDirections } from '@lib/models/game-object';
import { createEffect } from '@ngrx/effects';
import { fromEvent, map } from 'rxjs';
import { DirectionInputActions } from './direction-input.actions';

type InputKeys = 'ArrowUp' | 'KeyW' | 'ArrowDown' | 'KeyS' | 'ArrowLeft' | 'KeyA' | 'ArrowRight' | 'KeyD';

type DirectionInputMap = Record<string, GameObjectDirections>;

const DIRECTION_INPUT_MAP: DirectionInputMap = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

export const keydown$ = createEffect(
  (document = inject(DOCUMENT)) => {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map((event) => {
        const direction = DIRECTION_INPUT_MAP[event.code];
        return DirectionInputActions.addHeldDirection({ direction });
      }),
    );
  },
  { functional: true },
);

export const keyup$ = createEffect(
  (document = inject(DOCUMENT)) => {
    return fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      map((event) => {
        const direction = DIRECTION_INPUT_MAP[event.code];
        return DirectionInputActions.removeHeldDirection({ direction });
      }),
    );
  },
  { functional: true },
);
