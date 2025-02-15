import { GameObjects } from './game-object';
import { ItemGameObjects } from './game-object-item';
import { PersonGameObjects } from './game-object-person';

export type OverworldMapGameObjects = GameObjects | PersonGameObjects | ItemGameObjects;

export type OverworldMapCoords = `${number},${number}`;

export type OverworldMapWalls = Record<OverworldMapCoords, true>;

export interface OverworldMap {
  id: string;
  lowerSrc: string;
  upperSrc: string;
  gameObjects: OverworldMapGameObjects;
  walls: OverworldMapWalls;
  gameObjectWalls: OverworldMapWalls; // Game objects walls are stored in another property because they are continuously overwritten at runtime
}

export type OverWorldMaps = Record<string, OverworldMap>;
