import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OverworldMapFeatureKey, OverworldMapFeatureState } from './overworld-map.state';

export const selectOverworldMapState = createFeatureSelector<OverworldMapFeatureState>(OverworldMapFeatureKey);

export const selectCurrentMapId = createSelector(selectOverworldMapState, ({ currentMapId }) => ({
  currentMapId,
}));
export const selectOverworldMaps = createSelector(selectOverworldMapState, ({ maps }) => ({
  maps,
}));
