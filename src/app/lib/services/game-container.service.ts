import { inject, Injectable } from '@angular/core';
import { GameObject } from '@lib/models/game-object';
import { OverworldMap } from '@lib/models/overworld-map';
import { WINDOW } from '@lib/tokens/window';
import { expand, filter, map, Observable, of, share } from 'rxjs';

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

interface FrameData {
  frameStartTime: number;
  deltaTime: number;
}

const clampTo30FPS = (frame?: FrameData) => {
  if (!frame) {
    return frame;
  }

  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30;
  }
  return frame;
};

@Injectable({
  providedIn: 'root',
})
export class GameContainer {
  private readonly _window = inject(WINDOW);
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

  drawGameObject(gameObject: GameObject): void {
    const { x, y, id, hasShadow } = gameObject;
    const { gameCanvasContext } = this._containers;
    const gameObjectX = x - 8;
    const gameObjectY = y - 18;
    const currentGameObject = this._gameObjectsImages[id];

    if (!currentGameObject) {
      throw new Error('GameObject image not found');
    }

    const { image, shadowImage } = currentGameObject;

    if (hasShadow) {
      gameCanvasContext.drawImage(shadowImage, gameObjectX, gameObjectY);
    }

    gameCanvasContext.drawImage(image, 0, 0, 32, 32, gameObjectX, gameObjectY, 32, 32);
  }

  setMapImage(src: Pick<OverworldMap, 'lowerSrc' | 'upperSrc'>): void {
    const { lowerSrc, upperSrc } = src;

    this._mapImage.lowerImage.src = lowerSrc;
    this._mapImage.upperImage.src = upperSrc;
  }

  drawLowerMapLayer(): void {
    const { gameCanvasContext } = this._containers;
    gameCanvasContext.drawImage(this._mapImage.lowerImage, 0, 0);
  }

  drawUpperMapLayer(): void {
    const { gameCanvasContext } = this._containers;
    gameCanvasContext.drawImage(this._mapImage.upperImage, 0, 0);
  }

  private _calculateStep(prevFrame?: FrameData): Observable<FrameData | undefined> {
    return new Observable<FrameData | undefined>((observer) => {
      this._window.requestAnimationFrame((frameStartTime) => {
        // Millis to seconds
        const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
        observer.next({
          frameStartTime,
          deltaTime,
        });
      });
    }).pipe(map((frame) => clampTo30FPS(frame)));
  }

  getCurrentFrame() {
    return of(undefined).pipe(
      expand((val) => this._calculateStep(val)),
      // Expand emits the first value provided to it, and in this
      //  case we just want to ignore the undefined input frame
      filter((frame) => frame !== undefined),
      map((frame: FrameData) => frame.deltaTime),
      share(),
    );
  }
}
