import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { OverworldMapFeatureKey, OverworldMapFeatureState } from './overworld-map.state';

const selectOverworldMapState = createFeatureSelector<OverworldMapFeatureState>(OverworldMapFeatureKey);

export const selectOverworldMaps = createSelector(selectOverworldMapState, ({ maps }) => ({
  maps,
}));

export const selectCameraPerson = createSelector(
  selectGameObjects,
  selectOverworldMapState,
  (gameObjects, { cameraPersonId }) => gameObjects[cameraPersonId],
);

export const selectCameraPersonId = createSelector(selectOverworldMapState, ({ cameraPersonId }) => cameraPersonId);
