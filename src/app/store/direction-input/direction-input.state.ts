import { GameObjectDirections } from '@lib/models/game-object';
import { createReducer, on } from '@ngrx/store';
import { DirectionInputActions } from './direction-input.actions';

export const DirectionInputFeatureKey = 'DirectionInput';

export interface DirectionInputFeatureState {
  heldDirections: GameObjectDirections[];
}

const initialState: DirectionInputFeatureState = {
  heldDirections: [],
};

export const directionInputReducer = createReducer(
  initialState,
  on(DirectionInputActions.addHeldDirection, (state, { direction }): DirectionInputFeatureState => {
    if (!direction) {
      return state;
    }

    let heldDirections = [...state.heldDirections];

    if (heldDirections.indexOf(direction) === -1) {
      heldDirections = [direction, ...heldDirections];
    }

    return { ...state, heldDirections };
  }),
  on(DirectionInputActions.removeHeldDirection, (state, { direction }): DirectionInputFeatureState => {
    if (!direction) {
      return state;
    }

    const heldDirections = [...state.heldDirections];
    const index = heldDirections.indexOf(direction);

    if (index > -1) {
      heldDirections.splice(index, 1);
    }

    return { ...state, heldDirections };
  }),
);
