import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OverworldFeatureKey, OverworldFeatureState } from './overworld.state';

export const selectOverworldState = createFeatureSelector<OverworldFeatureState>(OverworldFeatureKey);

export const selectOverworldIsInitialized = createSelector(selectOverworldState, ({ isInitialized }) => ({
  isInitialized,
}));
