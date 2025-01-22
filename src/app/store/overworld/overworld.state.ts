import { createFeature, createReducer } from '@ngrx/store';

export const OverworldFeatureKey = 'Overworld';

export interface OverworldFeatureState {
  foo: unknown;
}

const initialState: OverworldFeatureState = {
  foo: null,
};

export const OverworldReducer = createReducer(initialState);

export const settingFeature = createFeature({
  name: OverworldFeatureKey,
  reducer: OverworldReducer,
});
