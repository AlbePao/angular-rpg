import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GameContainerService } from './lib/services/game-container.service';

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
  private readonly _containerHandlerService = inject(GameContainerService);
  gameContainer = viewChild<ElementRef<HTMLDivElement>>('gameContainer');
  gameCanvas = viewChild<ElementRef<HTMLCanvasElement>>('gameCanvas');

  ngAfterViewInit(): void {
    this._containerHandlerService.init({
      gameContainer: this.gameContainer()?.nativeElement,
      gameCanvas: this.gameCanvas()?.nativeElement,
    });
  }
}
