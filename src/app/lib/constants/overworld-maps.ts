import { OverWorldMaps } from '@lib/models/overworld-map';
import { DEFAULT_PERSON_ANIMATIONS } from './person-animations';

// TODO: implement zod validation when this object come from an external json
export const OVERWORLD_MAPS: OverWorldMaps = {
  DemoRoom: {
    id: 'DemoRoom',
    lowerSrc: '/images/maps/DemoLower.png',
    upperSrc: '/images/maps/DemoUpper.png',
    gameObjects: {
      hero: {
        id: 'hero',
        x: 5,
        y: 6,
        src: '/images/characters/people/hero.png',
        hasShadow: true,
        animations: DEFAULT_PERSON_ANIMATIONS,
        currentAnimation: 'idleDown',
        currentAnimationFrame: 0,
      },
      npc1: {
        id: 'npc1',
        x: 7,
        y: 9,
        src: '/images/characters/people/npc1.png',
        hasShadow: true,
        animations: DEFAULT_PERSON_ANIMATIONS,
        currentAnimation: 'idleDown',
        currentAnimationFrame: 0,
      },
    },
  },
  Kitchen: {
    id: 'Kitchen',
    lowerSrc: '/images/maps/KitchenLower.png',
    upperSrc: '/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: {
        id: 'hero',
        x: 3,
        y: 5,
        src: '/images/characters/people/hero.png',
        hasShadow: true,
        animations: DEFAULT_PERSON_ANIMATIONS,
        currentAnimation: 'idleDown',
        currentAnimationFrame: 0,
      },
      npcA: {
        id: 'npcA',
        x: 9,
        y: 6,
        src: '/images/characters/people/npc2.png',
        hasShadow: true,
        animations: DEFAULT_PERSON_ANIMATIONS,
        currentAnimation: 'idleDown',
        currentAnimationFrame: 0,
      },
      npcB: {
        id: 'npcB',
        x: 10,
        y: 8,
        src: '/images/characters/people/npc3.png',
        hasShadow: true,
        animations: DEFAULT_PERSON_ANIMATIONS,
        currentAnimation: 'idleDown',
        currentAnimationFrame: 0,
      },
    },
  },
};
