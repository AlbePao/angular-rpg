import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameObjectsFeatureKey, GameObjectsFeatureState } from './game-objects.state';

const selectGameObjectsState = createFeatureSelector<GameObjectsFeatureState>(GameObjectsFeatureKey);

export const selectGameObjects = createSelector(selectGameObjectsState, (gameObjects) => gameObjects);
