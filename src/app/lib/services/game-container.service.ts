import { inject, Injectable } from '@angular/core';
import { GameObject } from '@lib/models/game-object';
import { Store } from '@ngrx/store';
import { OverworldActions } from '@store/overworld/overworld.actions';

interface GameContainerConfig {
  gameContainer: HTMLDivElement;
  gameCanvas: HTMLCanvasElement;
}

type GameContainers = GameContainerConfig & {
  gameCanvasContext: CanvasRenderingContext2D;
};

interface MapImage {
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
}

type GameObjectsImages = Record<
  string,
  {
    image: HTMLImageElement;
    shadowImage: HTMLImageElement;
  }
>;

@Injectable({
  providedIn: 'root',
})
export class GameContainer {
  private readonly _store = inject(Store);

  get containers(): GameContainers {
    return this._containers;
  }
  private _containers!: GameContainers;

  mapImage: MapImage = {
    lowerImage: new Image(),
    upperImage: new Image(),
  };

  gameObjectsImages: GameObjectsImages = {};

  init({ gameContainer, gameCanvas }: GameContainerConfig): void {
    const gameCanvasContext = gameCanvas.getContext('2d');

    if (!gameCanvasContext) {
      throw new Error('Canvas context not found');
    }

    this._containers = {
      gameContainer,
      gameCanvas,
      gameCanvasContext,
    };

    this._store.dispatch(OverworldActions.init());
  }

  clearCanvas(): void {
    const { gameCanvasContext, gameCanvas } = this._containers;
    gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  }

  setGameObjectImage(gameObject: GameObject): void {
    const { id, hasShadow, src } = gameObject;
    let currentGameObject = this.gameObjectsImages[id];

    if (!currentGameObject) {
      currentGameObject = {
        image: new Image(),
        shadowImage: new Image(),
      };

      this.gameObjectsImages[id] = currentGameObject;
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      shadowImage.src = '/images/characters/shadow.png';
    }

    image.src = src;
  }

  drawGameObject(gameObject: GameObject): void {
    const { x, y, id, hasShadow } = gameObject;
    const { gameCanvasContext } = this._containers;
    const gameObjectX = x * 16 - 8;
    const gameObjectY = y * 16 - 18;
    const currentGameObject = this.gameObjectsImages[id];

    if (!currentGameObject) {
      throw new Error('GameObject image not found');
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      gameCanvasContext.drawImage(shadowImage, gameObjectX, gameObjectY);
    }

    gameCanvasContext.drawImage(image, 0, 0, 32, 32, gameObjectX, gameObjectY, 32, 32);
  }

  setMapImage(src: { lowerSrc: string; upperSrc: string }): void {
    const { lowerSrc, upperSrc } = src;

    this.mapImage.lowerImage.src = lowerSrc;
    this.mapImage.upperImage.src = upperSrc;
  }

  drawMapImage(): void {
    const { gameCanvasContext } = this._containers;

    gameCanvasContext.drawImage(this.mapImage.lowerImage, 0, 0);
    gameCanvasContext.drawImage(this.mapImage.upperImage, 0, 0);
  }
}
