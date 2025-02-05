import { BASE_GRID_SIZE } from '@lib/constants/game-objects';

export class Utils {
  static withGrid(value: number) {
    return value * BASE_GRID_SIZE;
  }
}
