import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OverworldActions } from '@store/overworld/overworld.actions';

interface GameContainerConfig {
  gameContainer: HTMLDivElement;
  gameCanvas: HTMLCanvasElement;
}

type GameContainers = GameContainerConfig & {
  gameCanvasContext: CanvasRenderingContext2D;
};

@Injectable({
  providedIn: 'root',
})
export class GameContainer {
  private readonly _store = inject(Store);

  get containers(): GameContainers {
    return this._containers;
  }
  private _containers!: GameContainers;

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
}
