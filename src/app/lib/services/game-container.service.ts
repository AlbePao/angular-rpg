import { Injectable } from '@angular/core';
import { BASE_CAMERA_X_OFFSET, BASE_CAMERA_Y_OFFSET } from '@lib/constants/game-objects';
import { GameObject } from '@lib/models/game-object';
import { OverworldMap } from '@lib/models/overworld-map';
import { Utils } from '@lib/utils';

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

type CameraOffset = Pick<GameObject, 'x' | 'y'>;

@Injectable({
  providedIn: 'root',
})
export class GameContainer {
  private _containers!: GameContainers;
  private _gameObjectsImages: GameObjectsImages = {};
  private _mapImage: MapImage = {
    lowerImage: new Image(),
    upperImage: new Image(),
  };

  init({ gameContainer, gameCanvas }: Partial<GameContainerConfig>): void {
    if (!gameContainer || !gameCanvas) {
      throw new Error('Game container or game canvas not found');
    }

    const gameCanvasContext = gameCanvas.getContext('2d');

    if (!gameCanvasContext) {
      throw new Error('Canvas context not found');
    }

    this._containers = {
      gameContainer,
      gameCanvas,
      gameCanvasContext,
    };
  }

  clearCanvas(): void {
    const { gameCanvasContext, gameCanvas } = this._containers;
    gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  }

  setGameObjectImage(gameObject: GameObject): void {
    const { id, hasShadow, src } = gameObject;
    let currentGameObject = this._gameObjectsImages[id];

    if (!currentGameObject) {
      currentGameObject = {
        image: new Image(),
        shadowImage: new Image(),
      };

      this._gameObjectsImages[id] = currentGameObject;
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      shadowImage.src = '/images/characters/shadow.png';
    }

    image.src = src;
  }

  drawGameObject(gameObject: GameObject, cameraOffset: CameraOffset): void {
    const { x, y, id, hasShadow, currentFrameCoords } = gameObject;
    const { x: offsetX, y: offsetY } = cameraOffset;
    const { gameCanvasContext } = this._containers;
    const gameObjectX = x - 8 + Utils.withGrid(BASE_CAMERA_X_OFFSET) - offsetX;
    const gameObjectY = y - 18 + Utils.withGrid(BASE_CAMERA_Y_OFFSET) - offsetY;
    const currentGameObject = this._gameObjectsImages[id];

    if (!currentGameObject) {
      throw new Error('GameObject image not found');
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      gameCanvasContext.drawImage(shadowImage, gameObjectX, gameObjectY);
    }

    const [frameX, frameY] = currentFrameCoords;

    gameCanvasContext.drawImage(image, frameX * 32, frameY * 32, 32, 32, gameObjectX, gameObjectY, 32, 32);
  }

  setMapImage(src: Pick<OverworldMap, 'lowerSrc' | 'upperSrc'>): void {
    const { lowerSrc, upperSrc } = src;

    this._mapImage.lowerImage.src = lowerSrc;
    this._mapImage.upperImage.src = upperSrc;
  }

  drawLowerMapLayer(cameraOffset: CameraOffset): void {
    const { x, y } = cameraOffset;
    const { gameCanvasContext } = this._containers;
    gameCanvasContext.drawImage(
      this._mapImage.lowerImage,
      Utils.withGrid(BASE_CAMERA_X_OFFSET) - x,
      Utils.withGrid(BASE_CAMERA_Y_OFFSET) - y,
    );
  }

  drawUpperMapLayer(cameraOffset: CameraOffset): void {
    const { x, y } = cameraOffset;
    const { gameCanvasContext } = this._containers;
    gameCanvasContext.drawImage(
      this._mapImage.upperImage,
      Utils.withGrid(BASE_CAMERA_X_OFFSET) - x,
      Utils.withGrid(BASE_CAMERA_Y_OFFSET) - y,
    );
  }
}
