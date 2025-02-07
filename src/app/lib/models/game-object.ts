import { AbstractGameObject } from './game-object-abstract';
import { GameObjectItem } from './game-object-item';
import { GameObjectPerson } from './game-object-person';

export type GameObjectCoords = Pick<AbstractGameObject, 'x' | 'y'>;

export type GameObject = GameObjectPerson | GameObjectItem;

export type GameObjects = Record<string, GameObject>;
