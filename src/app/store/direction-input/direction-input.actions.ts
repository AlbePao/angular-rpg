import { GameObjectDirections } from '@lib/models/game-object';
import { createActionGroup, props } from '@ngrx/store';

export const DirectionInputActions = createActionGroup({
  source: 'DirectionInput',
  events: {
    addHeldDirection: props<{ direction: GameObjectDirections | null }>(),
    removeHeldDirection: props<{ direction: GameObjectDirections | null }>(),
  },
});
