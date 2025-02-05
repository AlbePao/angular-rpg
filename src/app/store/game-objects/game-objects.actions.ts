import { GameObjects } from '@lib/models/game-object';
import { createActionGroup, props } from '@ngrx/store';

export const GameObjectsActions = createActionGroup({
  source: 'GameObjects',
  events: {
    setGameObjects: props<{ gameObjects: GameObjects }>(),
    updateGameObjects: props<{ gameObjects: GameObjects }>(),
  },
});
