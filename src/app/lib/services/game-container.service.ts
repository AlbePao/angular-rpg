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
export class GameContainerService {
  private readonly _store = inject(Store);

  get containers(): GameContainers {
    return this._containers;
  }
  private _containers!: GameContainers;

  init({ gameContainer, gameCanvas }: Partial<GameContainerConfig>): void {
    if (!gameContainer) {
      throw new Error('Game container not found');
    }

    if (!gameCanvas) {
      throw new Error('Game canvas not found');
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

    this._store.dispatch(OverworldActions.init());
  }
}
