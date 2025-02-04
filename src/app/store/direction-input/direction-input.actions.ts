import { GameObjectDirections } from '@lib/models/game-object';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const DirectionInputActions = createActionGroup({
  source: 'DirectionInput',
  events: {
    getHeldDirection: emptyProps(),
    setHeldDirections: props<{ heldDirections: GameObjectDirections[] }>(),
    addHeldDirection: props<{ direction: GameObjectDirections }>(),
    removeHeldDirection: props<{ direction: GameObjectDirections }>(),
  },
});
