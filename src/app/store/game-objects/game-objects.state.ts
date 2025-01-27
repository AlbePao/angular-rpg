import { GameObjects } from '@lib/models/game-object';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GameObjectsActions } from './game-objects.actions';

export const GameObjectsFeatureKey = 'GameObjects';

// TODO: differentiate gameObjects by type (Person, PizzaStone, etc.) and put each other into different state properties
export type GameObjectsFeatureState = GameObjects;

const initialState: GameObjectsFeatureState = {};

export const gameObjectsReducer = createReducer(
  initialState,
  on(
    GameObjectsActions.setGameObjects,
    (state, { gameObjects }): GameObjectsFeatureState => ({ ...state, ...gameObjects }),
  ),
);

export const gameObjectsFeature = createFeature({
  name: GameObjectsFeatureKey,
  reducer: gameObjectsReducer,
});
