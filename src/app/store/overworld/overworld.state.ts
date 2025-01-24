import { createFeature, createReducer } from '@ngrx/store';

export const OverworldFeatureKey = 'Overworld';

export interface OverworldFeatureState {
  foo: unknown;
}

const initialState: OverworldFeatureState = {
  foo: null,
};

export const overworldReducer = createReducer(initialState);

export const overworldFeature = createFeature({
  name: OverworldFeatureKey,
  reducer: overworldReducer,
});
