import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GameContainer } from '@lib/services/game-container.service';

@Component({
  selector: 'app-root',
  template: `
    <div #gameContainer class="game-container">
      <canvas #gameCanvas class="game-canvas" width="352" height="198"></canvas>
    </div>
  `,
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly _gameContainer = inject(GameContainer);

  gameContainer = viewChild<ElementRef<HTMLDivElement>>('gameContainer');
  gameCanvas = viewChild<ElementRef<HTMLCanvasElement>>('gameCanvas');

  ngAfterViewInit(): void {
    const gameContainer = this.gameContainer()?.nativeElement;
    const gameCanvas = this.gameCanvas()?.nativeElement;

    if (!gameContainer || !gameCanvas) {
      throw new Error('Game container or game canvas not found');
    }

    this._gameContainer.init({ gameContainer, gameCanvas });
  }
}
