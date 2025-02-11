import { OverWorldMaps, OverworldMap } from '@lib/models/overworld-map';
import { createReducer, on } from '@ngrx/store';
import { OverworldMapActions } from './overworld-map.actions';

export const OverworldMapFeatureKey = 'OverworldMap';

export interface OverworldMapFeatureState {
  isInitialized: boolean;
  maps: OverWorldMaps;
  currentMap: OverworldMap | null; // Whole map is saved into currentMap state to keep its local state and delete it on map change
  cameraPersonId: string;
}

const initialState: OverworldMapFeatureState = {
  isInitialized: false,
  maps: {},
  currentMap: null,
  cameraPersonId: '',
};

export const overworldMapReducer = createReducer(
  initialState,
  on(OverworldMapActions.init, (state): OverworldMapFeatureState => ({ ...state, isInitialized: true })),
  on(
    OverworldMapActions.init,
    OverworldMapActions.setOverworldMaps,
    (state, { maps }): OverworldMapFeatureState => ({ ...state, maps }),
  ),
  on(
    OverworldMapActions.init,
    OverworldMapActions.setCameraPerson,
    (state, { cameraPersonId }): OverworldMapFeatureState => ({ ...state, cameraPersonId }),
  ),
  on(
    OverworldMapActions.setCurrentMap,
    (state, { currentMap }): OverworldMapFeatureState => ({ ...state, currentMap }),
  ),
  on(OverworldMapActions.updateGameObjectWalls, (state, { gameObjectWalls }): OverworldMapFeatureState => {
    const { currentMap } = state;

    return {
      ...state,
      ...(currentMap && { currentMap: { ...currentMap, gameObjectWalls } }),
    };
  }),
);
