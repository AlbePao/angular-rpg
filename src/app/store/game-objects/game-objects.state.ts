import { GameObjects } from '@lib/models/game-object';
import { createReducer, on } from '@ngrx/store';
import { GameObjectsActions } from './game-objects.actions';

export const GameObjectsFeatureKey = 'GameObjects';

export type GameObjectsFeatureState = GameObjects;

const initialState: GameObjectsFeatureState = {};

export const gameObjectsReducer = createReducer(
  initialState,
  on(
    GameObjectsActions.setGameObjects,
    GameObjectsActions.updateGameObjects,
    GameObjectsActions.updateAnimationProgress,
    (state, { gameObjects }): GameObjectsFeatureState => ({ ...state, ...gameObjects }),
  ),
);
