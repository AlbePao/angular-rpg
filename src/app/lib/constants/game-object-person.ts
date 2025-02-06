import { PersonAnimationsMap, PersonDirectionUpdates } from '@lib/models/game-object-person';

export const PERSON_DIRECTION_UPDATES: PersonDirectionUpdates = {
  up: ['y', -1],
  down: ['y', 1],
  left: ['x', -1],
  right: ['x', 1],
};

export const PERSON_ANIMATIONS: PersonAnimationsMap = {
  'idle-down': [[0, 0]],
  'idle-right': [[0, 1]],
  'idle-up': [[0, 2]],
  'idle-left': [[0, 3]],
  'walk-down': [
    [1, 0],
    [0, 0],
    [3, 0],
    [0, 0],
  ],
  'walk-right': [
    [1, 1],
    [0, 1],
    [3, 1],
    [0, 1],
  ],
  'walk-up': [
    [1, 2],
    [0, 2],
    [3, 2],
    [0, 2],
  ],
  'walk-left': [
    [1, 3],
    [0, 3],
    [3, 3],
    [0, 3],
  ],
};
