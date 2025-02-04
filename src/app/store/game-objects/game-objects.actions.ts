import { GameObjects } from '@lib/models/game-object';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GameObjectsActions = createActionGroup({
  source: 'GameObjects',
  events: {
    setGameObjects: props<{ gameObjects: GameObjects }>(),
    drawGameObjects: emptyProps(),
    updateGameObjects: props<{ gameObjects: GameObjects }>(),
  },
});
