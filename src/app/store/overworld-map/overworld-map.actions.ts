import { OverworldCutscene, OverworldMap, OverWorldMaps } from '@lib/models/overworld-map';
import { createActionGroup, props } from '@ngrx/store';

export const OverworldMapActions = createActionGroup({
  source: 'OverworldMap',
  events: {
    init: props<{ maps: OverWorldMaps; currentMapId: string; cameraPersonId: string }>(),
    drawObjects: props<{ deltaTime: number }>(),
    setOverworldMaps: props<{ maps: OverWorldMaps }>(),
    setCurrentMap: props<{ currentMap: OverworldMap }>(),
    setCurrentMapById: props<{ currentMapId: string }>(),
    setCameraPerson: props<{ cameraPersonId: string }>(),
    setIsCutscenePlaying: props<{ isCutscenePlaying: boolean }>(),
    startCutscene: props<{ cutscene: OverworldCutscene[] }>(),
  },
});
