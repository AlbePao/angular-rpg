import { PersonDirections } from '@lib/models/game-object-person';
import { createActionGroup, props } from '@ngrx/store';

export const DirectionInputActions = createActionGroup({
  source: 'DirectionInput',
  events: {
    addHeldDirection: props<{ direction: PersonDirections | null }>(),
    removeHeldDirection: props<{ direction: PersonDirections | null }>(),
  },
});
