import { OverWorldMaps } from '@lib/models/overworld-map';
import { PERSON_ANIMATIONS } from './game-object-person';

export const FALLBACK_MAP = 'DemoRoom';

// TODO: implement zod validation when this object come from an external json
export const OVERWORLD_MAPS: OverWorldMaps = {
  [FALLBACK_MAP]: {
    id: FALLBACK_MAP,
    lowerSrc: '/images/maps/DemoLower.png',
    upperSrc: '/images/maps/DemoUpper.png',
    gameObjects: {
      hero: {
        id: 'hero',
        x: 5,
        y: 6,
        type: 'person',
        isPlayerControlled: true,
        movingProgressRemaining: 0,
        direction: 'down',
        src: '/images/characters/people/hero.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-down',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
      npcA: {
        id: 'npcA',
        x: 7,
        y: 9,
        type: 'person',
        isPlayerControlled: false,
        movingProgressRemaining: 0,
        direction: 'down',
        src: '/images/characters/people/npc1.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-down',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 500 },
          { type: 'stand', direction: 'right', time: 1200 },
          { type: 'stand', direction: 'up', time: 300 },
        ],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
      npcB: {
        id: 'npcB',
        x: 3,
        y: 7,
        type: 'person',
        isPlayerControlled: false,
        movingProgressRemaining: 0,
        direction: 'left',
        src: '/images/characters/people/npc2.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-left',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' },
        ],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
    },
    walls: {
      '7,6': true,
      '8,6': true,
      '7,7': true,
      '8,7': true,
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
        type: 'person',
        isPlayerControlled: true,
        movingProgressRemaining: 0,
        direction: 'down',
        src: '/images/characters/people/hero.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-down',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
      npcA: {
        id: 'npcA',
        x: 9,
        y: 6,
        type: 'person',
        isPlayerControlled: false,
        movingProgressRemaining: 0,
        direction: 'down',
        src: '/images/characters/people/npc2.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-down',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
      npcB: {
        id: 'npcB',
        x: 10,
        y: 8,
        type: 'person',
        isPlayerControlled: false,
        movingProgressRemaining: 0,
        direction: 'down',
        src: '/images/characters/people/npc3.png',
        hasShadow: true,
        animations: PERSON_ANIMATIONS,
        currentAnimation: 'stand-down',
        currentAnimationFrame: 0,
        animationFrameProgress: 0,
        behaviorLoop: [],
        behaviorLoopIndex: 0,
        currentBehaviorTimeElapsed: 0,
      },
    },
    walls: {},
  },
};
