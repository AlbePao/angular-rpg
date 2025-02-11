import { Injectable } from '@angular/core';
import { BASE_CAMERA_OFFSET_X, BASE_CAMERA_OFFSET_Y } from '@lib/constants/game-objects';
import { CameraOffset } from '@lib/models/camera-offset';
import { GameObject } from '@lib/models/game-object';
import { OverworldMap } from '@lib/models/overworld-map';
import { Utils } from '@lib/utils';

interface MapImages {
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
}

interface GameObjectImages {
  image: HTMLImageElement;
  shadowImage: HTMLImageElement;
}

type GameObjectsImages = Record<string, GameObjectImages>;

@Injectable({
  providedIn: 'root',
})
export class GameCanvas {
  private _gameCanvas!: HTMLCanvasElement;
  private _gameCanvasContext!: CanvasRenderingContext2D;

  private _gameObjectsImages: GameObjectsImages = {};
  private _mapImage: MapImages = {
    lowerImage: new Image(),
    upperImage: new Image(),
  };

  setGameCanvas(gameCanvas?: HTMLCanvasElement): void {
    if (!gameCanvas) {
      throw new Error('Game canvas not found');
    }

    const gameCanvasContext = gameCanvas.getContext('2d');

    if (!gameCanvasContext) {
      throw new Error('Canvas context not found');
    }

    this._gameCanvas = gameCanvas;
    this._gameCanvasContext = gameCanvasContext;
  }

  clearCanvas(): void {
    this._gameCanvasContext.clearRect(0, 0, this._gameCanvas.width, this._gameCanvas.height);
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
    const { x, y, id, hasShadow, animations, currentAnimation, currentAnimationFrame } = gameObject;
    const { offsetX, offsetY } = cameraOffset;
    const gameObjectX = x - 8 + Utils.withGrid(BASE_CAMERA_OFFSET_X) - offsetX;
    const gameObjectY = y - 18 + Utils.withGrid(BASE_CAMERA_OFFSET_Y) - offsetY;
    const currentGameObject = this._gameObjectsImages[id];

    if (!currentGameObject) {
      throw new Error('GameObject image not found');
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      this._gameCanvasContext.drawImage(shadowImage, gameObjectX, gameObjectY);
    }

    const [frameX, frameY] = animations[currentAnimation][currentAnimationFrame] ?? [1, 1];

    this._gameCanvasContext.drawImage(image, frameX * 32, frameY * 32, 32, 32, gameObjectX, gameObjectY, 32, 32);
  }

  setMapImage(src: Pick<OverworldMap, 'lowerSrc' | 'upperSrc'>): void {
    const { lowerSrc, upperSrc } = src;

    this._mapImage.lowerImage.src = lowerSrc;
    this._mapImage.upperImage.src = upperSrc;
  }

  drawLowerMapLayer(cameraOffset: CameraOffset): void {
    const { offsetX, offsetY } = cameraOffset;
    this._gameCanvasContext.drawImage(
      this._mapImage.lowerImage,
      Utils.withGrid(BASE_CAMERA_OFFSET_X) - offsetX,
      Utils.withGrid(BASE_CAMERA_OFFSET_Y) - offsetY,
    );
  }

  drawUpperMapLayer(cameraOffset: CameraOffset): void {
    const { offsetX, offsetY } = cameraOffset;
    this._gameCanvasContext.drawImage(
      this._mapImage.upperImage,
      Utils.withGrid(BASE_CAMERA_OFFSET_X) - offsetX,
      Utils.withGrid(BASE_CAMERA_OFFSET_Y) - offsetY,
    );
  }
}
