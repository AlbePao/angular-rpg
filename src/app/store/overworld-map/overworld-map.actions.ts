import { OverWorldMaps } from '@lib/models/overworld-map';
import { createActionGroup, props } from '@ngrx/store';

export const OverworldMapActions = createActionGroup({
  source: 'OverworldMap',
  events: {
    init: props<{
      maps: OverWorldMaps;
      currentMapId: string;
    }>(),
    setOverworldMaps: props<{
      maps: OverWorldMaps;
    }>(),
    setCurrentMap: props<{
      currentMapId: string;
    }>(),
  },
});
