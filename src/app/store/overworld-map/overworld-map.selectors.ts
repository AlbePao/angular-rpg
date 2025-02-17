import { OverworldMapWalls } from '@lib/models/overworld-map';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectGameObjects } from '@store/game-objects/game-objects.selectors';
import { OverworldMapFeatureKey, OverworldMapFeatureState } from './overworld-map.state';

const selectOverworldMapState = createFeatureSelector<OverworldMapFeatureState>(OverworldMapFeatureKey);

export const selectOverworldMaps = createSelector(selectOverworldMapState, ({ maps }) => maps);

export const selectCameraPerson = createSelector(
  selectGameObjects,
  selectOverworldMapState,
  (gameObjects, { cameraPersonId }) => gameObjects[cameraPersonId],
);

export const selectCameraPersonId = createSelector(selectOverworldMapState, ({ cameraPersonId }) => cameraPersonId);

export const selectCurrentMap = createSelector(selectOverworldMapState, ({ currentMap }) => currentMap);

export const selectCurrentMapWalls = createSelector(
  selectCurrentMap,
  selectGameObjects,
  (currentMap, gameObjects): OverworldMapWalls => {
    if (!currentMap) {
      return {};
    }

    // const { walls, gameObjectWalls } = currentMap;

    const { walls } = currentMap;

    const gameObjectWalls = Object.keys(gameObjects).reduce<OverworldMapWalls>((prev, currKey) => {
      const { x, y } = { ...gameObjects[currKey] };
      return { ...prev, [`${x},${y}`]: true };
    }, {});

    return { ...walls, ...gameObjectWalls };
  },
);


export const selectCurrentDeltaTime = createSelector(selectOverworldMapState, ({ deltaTime }) => deltaTime);
