import { OverWorldMaps, OverworldMap } from '@lib/models/overworld-map';
import { createReducer, on } from '@ngrx/store';
import { OverworldMapActions } from './overworld-map.actions';

export const OverworldMapFeatureKey = 'OverworldMap';

export interface OverworldMapFeatureState {
  isInitialized: boolean;
  deltaTime: number;
  maps: OverWorldMaps;
  currentMap: OverworldMap | null; // Whole map is saved into currentMap state to keep its local state and delete it on map change
  cameraPersonId: string;
  isCutscenePlaying: boolean;
}

const initialState: OverworldMapFeatureState = {
  isInitialized: false,
  deltaTime: 0,
  maps: {},
  currentMap: null,
  cameraPersonId: '',
  isCutscenePlaying: false,
};

export const overworldMapReducer = createReducer(
  initialState,
  on(OverworldMapActions.init, (state): OverworldMapFeatureState => ({ ...state, isInitialized: true })),
  on(OverworldMapActions.drawObjects, (state, { deltaTime }): OverworldMapFeatureState => ({ ...state, deltaTime })),
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
  on(OverworldMapActions.startCutscene, (state): OverworldMapFeatureState => ({ ...state, isCutscenePlaying: true })),
  on(
    OverworldMapActions.setIsCutscenePlaying,
    (state, { isCutscenePlaying }): OverworldMapFeatureState => ({ ...state, isCutscenePlaying }),
  ),
);
