import { OverWorldMaps } from '@lib/models/overworld-map';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OverworldMapActions } from './overworld-map.actions';

export const OverworldMapFeatureKey = 'OverworldMap';

export interface OverworldMapFeatureState {
  maps: OverWorldMaps;
  currentMapId: string;
}

const initialState: OverworldMapFeatureState = {
  maps: {},
  currentMapId: '',
};

export const overworldMapReducer = createReducer(
  initialState,
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

export const overworldMapFeature = createFeature({
  name: OverworldMapFeatureKey,
  reducer: overworldMapReducer,
});
