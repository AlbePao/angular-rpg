import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameContainer {
  private _gameContainer!: HTMLDivElement;

  setGameContainer(gameContainer?: HTMLDivElement): void {
    if (!gameContainer) {
      throw new Error('Game container not found');
    }

    this._gameContainer = gameContainer;
  }
}
