import { createReducer, on } from '@ngrx/store';
import { DirectionInputActions } from './direction-input.actions';

export const DirectionInputFeatureKey = 'DirectionInput';

export interface DirectionInputFeatureState {
  heldDirections: string[];
}

const initialState: DirectionInputFeatureState = {
  heldDirections: [],
};

export const directionInputReducer = createReducer(
  initialState,
  on(
    DirectionInputActions.setHeldDirections,
    (state, { heldDirections }): DirectionInputFeatureState => ({ ...state, heldDirections }),
  ),
  on(DirectionInputActions.addHeldDirection, (state, { direction }): DirectionInputFeatureState => {
    let heldDirections = [...state.heldDirections];

    if (direction && heldDirections.indexOf(direction) === -1) {
      heldDirections = [direction, ...heldDirections];
    }

    return { ...state, heldDirections };
  }),
  on(DirectionInputActions.removeHeldDirection, (state, { direction }): DirectionInputFeatureState => {
    let heldDirections = [...state.heldDirections];
    const index = heldDirections.indexOf(direction);

    if (index > -1) {
      heldDirections = heldDirections.splice(index, 1);
    }

    return { ...state, heldDirections };
  }),
);
