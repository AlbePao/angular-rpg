import { GameObject } from '@lib/models/game-object';
import { createActionGroup, props } from '@ngrx/store';

export const GameObjectsActions = createActionGroup({
  source: 'GameObjects',
  events: {
    setGameObjects: props<{ gameObjects: Record<string, GameObject> }>(),
    drawGameObject: props<{ gameObject: GameObject }>(),
  },
});
