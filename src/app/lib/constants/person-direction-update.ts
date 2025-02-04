import { PersonDirectionUpdates } from '@lib/models/game-object';

export const PERSON_DIRECTION_UPDATE: PersonDirectionUpdates = {
  up: ['y', -1],
  down: ['y', 1],
  left: ['x', -1],
  right: ['x', 1],
};
