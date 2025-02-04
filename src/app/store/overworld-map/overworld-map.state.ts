import { OverWorldMaps } from '@lib/models/overworld-map';
import { createReducer, on } from '@ngrx/store';
import { OverworldMapActions } from './overworld-map.actions';

export const OverworldMapFeatureKey = 'OverworldMap';

export interface OverworldMapFeatureState {
  isInitialized: boolean;
  maps: OverWorldMaps;
  currentMapId: string;
}

const initialState: OverworldMapFeatureState = {
  isInitialized: false,
  maps: {},
  currentMapId: '',
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
    OverworldMapActions.setCurrentMap,
    (state, { currentMapId }): OverworldMapFeatureState => ({ ...state, currentMapId }),
  ),
);
