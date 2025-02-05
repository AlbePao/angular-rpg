import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OverworldMapFeatureKey, OverworldMapFeatureState } from './overworld-map.state';

const selectOverworldMapState = createFeatureSelector<OverworldMapFeatureState>(OverworldMapFeatureKey);

export const selectOverworldMaps = createSelector(selectOverworldMapState, ({ maps }) => ({
  maps,
}));
