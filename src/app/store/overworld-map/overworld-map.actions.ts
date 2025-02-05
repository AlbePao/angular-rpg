import { OverWorldMaps } from '@lib/models/overworld-map';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const OverworldMapActions = createActionGroup({
  source: 'OverworldMap',
  events: {
    init: props<{ maps: OverWorldMaps; currentMapId: string; cameraPersonId: string }>(),
    drawObjects: emptyProps(),
    setOverworldMaps: props<{ maps: OverWorldMaps }>(),
    setCurrentMap: props<{ currentMapId: string }>(),
    setCameraPerson: props<{ cameraPersonId: string }>(),
  },
});
