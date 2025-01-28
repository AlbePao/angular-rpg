import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DirectionInputFeatureKey, DirectionInputFeatureState } from './direction-input.state';

export const selectDirectionInputState = createFeatureSelector<DirectionInputFeatureState>(DirectionInputFeatureKey);

export const selectDirection = createSelector(selectDirectionInputState, ({ heldDirections }) => heldDirections[0]);

export const selectHeldDirections = createSelector(selectDirectionInputState, ({ heldDirections }) => heldDirections);
