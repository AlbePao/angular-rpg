import { createReducer, on } from '@ngrx/store';
import { OverworldActions } from './overworld.actions';

export const OverworldFeatureKey = 'Overworld';

export interface OverworldFeatureState {
  isInitialized: boolean;
}

const initialState: OverworldFeatureState = {
  isInitialized: false,
};

export const overworldReducer = createReducer(
  initialState,
  on(OverworldActions.init, (state): OverworldFeatureState => ({ ...state, isInitialized: true })),
);
