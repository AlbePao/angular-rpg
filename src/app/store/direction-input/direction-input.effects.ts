import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { PersonDirections } from '@lib/models/game-object-person';
import { createEffect } from '@ngrx/effects';
import { fromEvent, map } from 'rxjs';
import { DirectionInputActions } from './direction-input.actions';

const INPUT_KEYS = ['ArrowUp', 'KeyW', 'ArrowDown', 'KeyS', 'ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'] as const;
type InputKeys = (typeof INPUT_KEYS)[number];

type DirectionInputMap = Record<InputKeys, PersonDirections>;

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

function isAllowedKey(keyInput: string): keyInput is InputKeys {
  return INPUT_KEYS.includes(keyInput);
}

export const keydown = createEffect(
  (document = inject(DOCUMENT)) => {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map(({ code }) =>
        DirectionInputActions.addHeldDirection({ direction: isAllowedKey(code) ? DIRECTION_INPUT_MAP[code] : null }),
      ),
    );
  },
  { functional: true },
);

export const keyup = createEffect(
  (document = inject(DOCUMENT)) => {
    return fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      map(({ code }) =>
        DirectionInputActions.removeHeldDirection({ direction: isAllowedKey(code) ? DIRECTION_INPUT_MAP[code] : null }),
      ),
    );
  },
  { functional: true },
);
