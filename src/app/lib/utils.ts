import { BASE_GRID_SIZE } from '@lib/constants/game-objects';
import { GameObject, GameObjectCoords } from './models/game-object';
import { GameObjectItem } from './models/game-object-item';
import { GameObjectPerson, PersonDirections } from './models/game-object-person';
import { OverworldMapWalls } from './models/overworld-map';

export class Utils {
  static withGrid(value: number): number {
    return value * BASE_GRID_SIZE;
  }

  static nextPosition(initialX: number, initialY: number, direction: PersonDirections): GameObjectCoords {
    let x = initialX;
    let y = initialY;

    if (direction === 'left') {
      x -= BASE_GRID_SIZE;
    } else if (direction === 'right') {
      x += BASE_GRID_SIZE;
    } else if (direction === 'up') {
      y -= BASE_GRID_SIZE;
    } else if (direction === 'down') {
      y += BASE_GRID_SIZE;
    }

    return { x, y };
  }

  static isSpaceTaken(
    initialX: number,
    initialY: number,
    direction: PersonDirections,
    walls: OverworldMapWalls,
  ): boolean {
    const { x, y } = this.nextPosition(initialX, initialY, direction);

    return walls[`${x},${y}`] || false;
  }

  static isGameObjectPerson(gameObject: GameObject): gameObject is GameObjectPerson {
    return gameObject.type === 'person';
  }

  static isGameObjectItem(gameObject: GameObject): gameObject is GameObjectItem {
    return gameObject.type === 'item';
  }
}
